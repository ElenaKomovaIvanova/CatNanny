from rest_framework import serializers
from .models import Visit
from users.models import Profile  # Импорт модели Profile
from orders.models import Orders   # Импорт модели Orders

class VisitSerializer(serializers.ModelSerializer):
    catnanny = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    order = serializers.PrimaryKeyRelatedField(queryset=Orders.objects.all())

    class Meta:
        model = Visit
        fields = ['id', 'catnanny', 'date', 'order', 'created_at']
