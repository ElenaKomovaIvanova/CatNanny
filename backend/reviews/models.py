from users.models import Profile
from django.db import models

class Review(models.Model):
    # Поле для хранения даты создания отзыва
    created_at = models.DateTimeField(auto_now_add=True)

    # Владелец отзыва - ссылается на профиль, оставивший отзыв
    owner = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='reviews_made'
    )

    # ID котоняни - ссылается на профиль, получивший отзыв
    catnanny = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='reviews_received'
    )

    # Текст отзыва
    review = models.TextField()

    # Оценка от 1 до 10
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 11)])

    def __str__(self):
        return f"Review by {self.owner.user.first_name} {self.owner.user.last_name} for {self.catnanny.user.first_name} {self.catnanny.user.last_name} - Rating: {self.rating}"

    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'
        ordering = ['-created_at']