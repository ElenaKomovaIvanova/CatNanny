from datetime import date, datetime

from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from .models import Profile
from .serializers import RegisterSerializer, ProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import error_response
from schedule.views import get_available_user_ids


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
                details=e.detail,
                error_code="VALIDATION_ERROR",
                status_code=status.HTTP_400_BAD_REQUEST
            )


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return response
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


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        if id:
            # Получение профиля по указанному id
            profile = get_object_or_404(Profile, id=id)
        else:
            # Получение профиля текущего пользователя
            profile = Profile.objects.get(user=request.user)

        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class NanniesListAPI(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        # Базовый запрос для профилей котонянь
        queryset = Profile.objects.filter(is_catnanny=True)

        # Проверка, заданы ли даты
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            except ValueError:
                return Profile.objects.none()  # Вернуть пустой набор, если даты некорректны


            # Получаем список занятых пользователей
            unavailable_user_ids = get_available_user_ids(start_date, end_date)

            # Исключаем занятых пользователей из запроса
            queryset = queryset.exclude(user_id__in=unavailable_user_ids)

        return queryset