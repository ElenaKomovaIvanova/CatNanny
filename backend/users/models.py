from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to User model
    phone_number = models.CharField(max_length=15)
    bio = models.TextField(max_length=500)  # User information
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    has_pets = models.BooleanField(default=False)  # Indicates if the user has pets
    has_children_under_10 = models.BooleanField(default=False)  # Indicates if the user has children under 10
    pickup = models.BooleanField(default=False)
    visit = models.BooleanField(default=False)
    photo = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_catnanny = models.BooleanField(default=False)  # User is a catnanny
    is_pet_owner = models.BooleanField(default=False) # User is a pet owner

    def __str__(self):
        return f"Profile of {self.user.username}"

    def get_average_rating(self):
        # Вычисляем средний рейтинг на основе отзывов
        average_rating = self.reviews_received.aggregate(Avg('rating'))['rating__avg'] or 0
        return round(average_rating, 1)



# class Review(models.Model):
#     request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name='reviews')
#     reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='written_reviews')
#     catnanny = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews')
#
#     rating = models.PositiveSmallIntegerField()  # Rating out of 5, for example
#     comment = models.TextField(max_length=1000, blank=True)  # Optional review comment
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return f"Review by {self.reviewer.username} for {self.catnanny.username} with rating {self.rating}"
#
#     class Meta:
#         unique_together = ('request', 'reviewer')  # Ensures only one review per request from a user
