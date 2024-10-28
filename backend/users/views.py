from math import trunc
from operator import truediv

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

    def get(self, request):
        # Get the current user's profile
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class NanniesListAPI(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Profile.objects.filter(is_catnanny=True)