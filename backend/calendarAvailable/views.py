from datetime import date
from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import UnavailablePeriod
from .serializers import UnavailablePeriodSerializer


class AvailabilityManager:
    @staticmethod
    def get_available_user_ids(start_date: date, end_date: date):
        """Возвращает список ID пользователей, доступных в указанный период."""
        unavailable_user_ids = UnavailablePeriod.objects.filter(
            Q(start_date__lte=end_date) & Q(end_date__gte=start_date) |  # Любое пересечение
            Q(start_date__gte=start_date) & Q(end_date__lte=end_date)    # Полностью внутри диапазона
        ).values_list('user', flat=True)

        # Возвращаем список доступных пользователей, исключая недоступных
        return unavailable_user_ids


class UnavailablePeriodCreateAPI(generics.CreateAPIView):
    queryset = UnavailablePeriod.objects.all()
    serializer_class = UnavailablePeriodSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UnavailablePeriodListAPI(generics.ListAPIView):
    queryset = UnavailablePeriod.objects.all()
    serializer_class = UnavailablePeriodSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        # Возвращаем только периоды, относящиеся к текущему пользователю
        return self.queryset.filter(user=self.request.user)
