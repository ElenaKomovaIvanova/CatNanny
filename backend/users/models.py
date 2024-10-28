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
    pickup = models.BooleanField(default=False)
    visit = models.BooleanField(default=False)
    photo = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_catnanny = models.BooleanField(default=False)  # User is a catnanny
    is_pet_owner = models.BooleanField(default=False) # User is a pet owner

    def __str__(self):
        return f"Profile of {self.user.username}"


# class UnavailableDate(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='unavailable_dates')
#     date = models.DateField()  # Specific date when the catnanny is unavailable
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return f"{self.user.username} unavailable on {self.date}"
#
#     class Meta:
#         unique_together = ('user', 'date')  # Ensures each date is unique for a specific user
#
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
