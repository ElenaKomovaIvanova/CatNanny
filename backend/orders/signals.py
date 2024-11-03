# orders/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Orders, OrderStatusLog, OrderStatusModel

@receiver(post_save, sender=Orders)
def create_initial_order_status(sender, instance, created, **kwargs):
    if created:
        # Получаем или создаем начальный статус "new"
        initial_status, _ = OrderStatusModel.objects.get_or_create(status='new')

        # Создаем запись в журнале статусов
    OrderStatusLog.objects.create(
        order=instance,  # Передаем сам объект, так как поле `ForeignKey`
        status_order=initial_status,
        updated_by=instance.owner  # Устанавливаем владельца как инициатора статуса
    )
