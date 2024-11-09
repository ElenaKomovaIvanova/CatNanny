from datetime import date, datetime
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from .models import Profile
from .permissions import IsAuthenticatedOrReadOnlyForSpecificProfile
from .serializers import RegisterSerializer, ProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import error_response
from calendarAvailable.views import AvailabilityManager
from rest_framework.decorators import api_view
from rest_framework.pagination import LimitOffsetPagination


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            # Validate and save user data
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            # Create profile for the user
            Profile.objects.get_or_create(user=user)

            # Generate tokens for the new user
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            return error_response(
                error="Database error",
                details=str(e),
                error_code="DATABASE_ERROR",
                status_code=status.HTTP_400_BAD_REQUEST,
                suggestion="Perhaps a user with the same name or email already exists."
            )

        except ValidationError as e:
            return error_response(
                error="Validation error",
                details=str(e),
                error_code="VALIDATION_ERROR",
                status_code=status.HTTP_400_BAD_REQUEST
            )


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            # Выполнение родительского метода для аутентификации и получения токенов
            response = super().post(request, *args, **kwargs)

            # Получаем токен из ответа
            access_token = response.data.get('access')

            # Проверяем, есть ли токен
            if access_token:
                # Создаем объект JWTAuthentication
                jwt_auth = JWTAuthentication()
                validated_token = jwt_auth.get_validated_token(access_token)

                # Получаем пользователя по токену
                user = jwt_auth.get_user(validated_token)
                profile = Profile.objects.get(user=user)
                response.data['profile_id'] = profile.id
            return response

        except AuthenticationFailed as e:
            # Добавьте обработку ошибки при неправильном пароле
            return error_response(
                error="Authentication error",
                details=str(e.detail),
                error_code="AUTHENTICATION_FAILED",
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        except Exception as e:
            return error_response(
                error="Login error",
                details=str(e),
                error_code="LOGIN_ERROR",
                status_code=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token

            return Response(status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return error_response(
                error="Logout error",
                details=str(e),
                error_code="LOGOUT_ERROR",
                status_code=status.HTTP_400_BAD_REQUEST
            )


class ProfileCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            profile = Profile(user=user)

        request_data = request.data.copy()  # Create a mutable copy
        request_data['user'] = user.id

        serializer = ProfileSerializer(profile, data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Use error_response for validation errors
        return error_response(
            error="Validation failed",
            details=serializer.errors,
            error_code="VALIDATION_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def upload_image(request):
    unique_filename = request.data.get('filename')  # Получаем уникальное имя файла
    image_data = request.data.get('file')  # Base64 кодировка

    if not unique_filename or not image_data:
        return JsonResponse({'error': 'Filename and image data are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Удаление префикса "data:image/jpeg;base64,"
        if "base64," in image_data:
            image_data = image_data.split("base64,")[1]

        # Декодируем Base64 изображение
        decoded_image_data = base64.b64decode(image_data)

        # Загрузка в S3
        s3 = boto3.client('s3', region_name=settings.AWS_REGION)
        s3.put_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=unique_filename,
            Body=decoded_image_data,
            ContentType='image/jpeg'
        )

        return JsonResponse({'message': 'Image uploaded successfully!'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnlyForSpecificProfile]

    def get(self, request, id=None):
        if id:
            # Разрешаем доступ к профилю по id для всех пользователей
            profile = get_object_or_404(Profile, id=id)
        else:
            # Требуем авторизацию для доступа к собственному профилю, если id не указан
            if not request.user.is_authenticated:
                return Response(
                    {"error": "Authentication required to access your own profile."},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            profile = Profile.objects.get(user=request.user)

        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class NanniesListAPI(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        queryset = Profile.objects.filter(is_catnanny=True)

        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            except ValueError:
                return Profile.objects.none()

            # Используем `get_unavailable_user_ids` для фильтрации занятых нянь
            unavailable_user_ids = AvailabilityManager.get_available_user_ids(start_date, end_date)

            queryset = queryset.exclude(user__in=unavailable_user_ids)
        return queryset