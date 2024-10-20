from .models import Profile
from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']

    def validate_username(self, value):
        # Проверка, существует ли пользователь с таким же именем
        if User.objects.filter(username=value).exists():

            raise serializers.ValidationError("A user with the same name already exists.")
        return value

    def validate_email(self, value):
        # Проверка уникальности email
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email is already registered.")
        return value

    def create(self, validated_data):
        print(validated_data)
        # Создание пользователя с валидацией
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
        fields = '__all__'

    # def create(self, validated_data):
    #     print(2)
    #     user = self.context['user']
    #     profile = Profile.objects.create(user=user, **validated_data)
    #     return profile