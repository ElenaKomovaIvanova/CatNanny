# orders/views.py
# orders/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Orders
from .serializers import OrdersSerializer

class OrdersListAPI(generics.ListAPIView):
    serializer_class = OrdersSerializer

    def get_queryset(self):
        owner = self.request.user
        return Orders.objects.filter(owner=owner)


class OrderDetailAPI(generics.RetrieveAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ограничиваем доступ только для заявок текущего пользователя
        owner = self.request.user
        return Orders.objects.filter(owner=owner)