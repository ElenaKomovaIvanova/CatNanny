from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to User model
    phone_number = models.CharField(max_length=15)
    bio = models.TextField(max_length=500)  # User information
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    has_pets = models.BooleanField(default=False)  # Indicates if the user has pets
    has_children_under_10 = models.BooleanField(default=False)  # Indicates if the user has children under 10
    work_at_my_house = models.BooleanField(default=False)
    works_at_client_site = models.BooleanField(default=False)
    photo = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
