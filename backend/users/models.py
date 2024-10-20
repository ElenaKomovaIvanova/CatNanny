
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    bio = models.TextField(max_length=500)  # Информация о пользователе
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    has_pets = models.BooleanField(default=False)  # Есть ли домашние животные
    has_children_under_10 = models.BooleanField(default=False)  # Есть ли дети до 10 лет
    work_at_my_house = models.BooleanField(default=False)
    works_at_client_site = models.BooleanField(default=False)
    photo_url = models.URLField(max_length=200)  # Ссылка на фото

    def __str__(self):
        return f"Profile of {self.user.username}"
