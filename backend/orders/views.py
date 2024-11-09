from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Orders, OrderStatusLog, OrderStatusModel
from .serializers import OrdersSerializer, OrderStatusLogSerializer


class OrdersListAPI(generics.ListAPIView):
    serializer_class = OrdersSerializer

    def get_queryset(self):
        user = self.request.user
        # Используем `catnanny__user` для связи `Profile` с `User`
        queryset = Orders.objects.filter(Q(owner=user) | Q(catnanny__user=user))
        return queryset


class OrderDetailAPI(generics.RetrieveUpdateAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Orders.objects.filter(Q(owner=user) | Q(catnanny__user=user))


class OrderCreateAPI(generics.CreateAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Устанавливаем владельца заказа как текущего пользователя
        serializer.save(owner=self.request.user)


class OrderUpdateStatusAPI(generics.CreateAPIView):
    queryset = OrderStatusLog.objects.all()
    serializer_class = OrderStatusLogSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        order_id = self.request.data.get('order_id')
        new_status_name = self.request.data.get('status_order')  # Имя статуса из фронтенда

        # Получаем заказ
        order = get_object_or_404(Orders, id=order_id)

        # Ищем объект OrderStatusModel по названию статуса
        status_instance = get_object_or_404(OrderStatusModel, status=new_status_name)

        # Создаем новую запись в OrderStatusLog с найденным статусом
        serializer.save(order=order, status_order=status_instance, updated_by=self.request.user)
