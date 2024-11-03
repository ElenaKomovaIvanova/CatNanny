from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class UnavailablePeriod(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='unavailable_periods')
    start_date = models.DateField()  # Начало периода занятости
    end_date = models.DateField()    # Конец периода занятости
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.start_date == self.end_date:
            return f"{self.user.username} unavailable on {self.start_date}"
        else:
            return f"{self.user.username} unavailable from {self.start_date} to {self.end_date}"

    class Meta:
        unique_together = ('user', 'start_date', 'end_date')  # Уникальная запись для периода
