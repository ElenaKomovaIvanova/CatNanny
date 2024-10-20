from .models import Profile
from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']

    def validate_username(self, value):
        # Check if a user with the same username exists
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with the same name already exists.")
        return value

    def validate_email(self, value):
        # Check for unique email
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email is already registered.")
        return value

    def create(self, validated_data):
        # Create user with validation
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone_number', 'bio', 'city', 'address', 'has_pets', 'has_children_under_10',
                  'work_at_my_house', 'works_at_client_site', 'photo']
