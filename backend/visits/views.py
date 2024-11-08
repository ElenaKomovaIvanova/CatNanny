from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Visit
from .serializers import VisitSerializer


class VisitListCreateAPI(generics.ListCreateAPIView):
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Получаем профиль текущего пользователя
        user_profile = self.request.user.profile

        # Получаем параметр `orderId` из запроса
        order_id = self.request.query_params.get('order', None)

        if order_id is not None:
            queryset = Visit.objects.filter(order_id=order_id)

        return queryset
