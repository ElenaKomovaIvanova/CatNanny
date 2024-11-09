# chat/models.py
from django.db import models
from orders.models import Orders  # Импортируйте вашу модель заказов
from users.models import Profile  # Импортируйте вашу модель профиля

class ChatMessage(models.Model):
    order = models.ForeignKey(Orders, related_name='chat_messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE)  # Изменено на Profile
    message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.user.username}: {self.message[:20]}..."  # Предполагается, что у Profile есть связь с User
