from rest_framework import serializers
from .models import Orders, OrderStatusModel, OrderStatusLog


class OrdersSerializer(serializers.ModelSerializer):
    current_status = serializers.SerializerMethodField()
    allowed_statuses = serializers.SerializerMethodField()

    def get_current_status(self, obj):
        latest_status_log = obj.status_logs.order_by('-timestamp').first()
        # Убедитесь, что правильно обращаетесь к `status_order`
        return latest_status_log.status_order.status if latest_status_log else None

    def get_allowed_statuses(self, obj):
        user = self.context['request'].user
        user_role = 'catnanny' if obj.catnanny.user == user else 'owner' if obj.owner == user else None
        current_status = self.get_current_status(obj)

        if current_status and user_role:
            return OrderStatusModel.get_next_statuses(current_status, obj, user_role)
        return []

    catnanny_first_name = serializers.CharField(source='catnanny.user.first_name', read_only=True)
    catnanny_last_name = serializers.CharField(source='catnanny.user.last_name', read_only=True)

    class Meta:
        model = Orders
        fields = [
            'id', 'start_date', 'end_date', 'catnanny', 'cat_name', 'cat_gender',
            'cat_weight', 'cat_age', 'stay_type', 'message',
            'catnanny_first_name', 'catnanny_last_name', 'current_status', 'allowed_statuses'
        ]


class OrderStatusLogSerializer(serializers.ModelSerializer):
    status_order = serializers.CharField()  # Ожидаем строковое значение статуса

    class Meta:
        model = OrderStatusLog
        fields = ['order_id', 'status_order', 'updated_by', 'timestamp']
        read_only_fields = ['updated_by', 'timestamp']

    def validate_status_order(self, value):
        """Преобразование строкового значения статуса в объект OrderStatusModel."""
        try:
            # Находим объект статуса по строковому значению
            status_obj = OrderStatusModel.objects.get(status=value)
            return status_obj
        except OrderStatusModel.DoesNotExist:
            raise serializers.ValidationError("Invalid status value.")

    def create(self, validated_data):
        # Обновляем updated_by текущим пользователем
        validated_data['updated_by'] = self.context['request'].user
        return super().create(validated_data)