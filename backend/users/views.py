from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.db import IntegrityError
from .models import Profile
from .serializers import RegisterSerializer, ProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            # Проверка на корректность данных
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            # Генерация токенов для нового пользователя
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh_token': str(refresh),
                'access_token': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            return Response({
                "error": "Database error",
                "details": str(e),  # Подробности ошибки (например, уникальные поля)
                "error_code": "DATABASE_ERROR",  # Уникальный код ошибки
                "suggestion": "Perhaps a user with the same name or email already exists.",  # Рекомендация
                "status_code": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)


        except ValidationError as e:
            return Response({
                "error": "Validation error",  # Общее сообщение об ошибке
                "details": e.detail,  # Подробные данные об ошибке
                "error_code": "VALIDATION_ERROR",  # Уникальный код ошибки
                "status_code": status.HTTP_400_BAD_REQUEST  # Статус ошибки
            }, status=status.HTTP_400_BAD_REQUEST)


# Представление для логина
class LoginView(TokenObtainPairView):
    pass


# Представление для обновления токенов
# class RefreshTokenView(TokenRefreshView):
#     pass

# Представление для разлогирования
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Добавляем токен в черный список

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ProfileCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Убедитесь, что запрос аутентифицирован

    def put(self, request, *args, **kwargs):
        user = request.user  # Получаем аутентифицированного пользователя
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            profile = Profile(user=user)

        # Копируем данные запроса и добавляем поле user
        request_data = request.data.copy()
        request_data['user'] = user.id  # Присваиваем аутентифицированного пользователя

        serializer = ProfileSerializer(profile, data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)