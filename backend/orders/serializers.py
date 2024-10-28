# orders/serializers.py
from rest_framework import serializers
from .models import Orders


class OrdersSerializer(serializers.ModelSerializer):

    catnanny_first_name = serializers.CharField(source='catnanny.first_name', read_only=True)
    catnanny_last_name = serializers.CharField(source='catnanny.last_name', read_only=True)

    class Meta:
        model = Orders
        fields = [
            'id', 'start_date', 'end_date', 'catnanny', 'cat_name', 'cat_gender',
            'cat_weight', 'cat_age', 'stay_type', 'message',
            'catnanny_first_name', 'catnanny_last_name'
        ]
