from django.db import models
from django.contrib.auth.models import User

class Review(models.Model):
    # Field to store the creation date of the review
    created_at = models.DateTimeField(auto_now_add=True)

    # Review owner - refers to the user who left the review
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews_made'  # Custom related_name to avoid conflicts with other models
    )

    # Catnanny ID - refers to the user who receives the review
    catnanny = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews_received'
    )

    # Review text
    review = models.TextField()

    # Rating from 1 to 10
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 11)])

    def __str__(self):
        return f"Review by {self.owner} for {self.catnanny} - Rating: {self.rating}"

    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'
        ordering = ['-created_at']
