# visits/models.py
from django.db import models
from users.models import Profile

class Visit(models.Model):
    catnanny = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='visits')  # Измените здесь
    date = models.DateField()
    order = models.ForeignKey('orders.Orders', on_delete=models.CASCADE, related_name='visits')  # Используем строковую ссылку
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Visit on {self.date} for order {self.order.id} by {self.catnanny.user.username}"
