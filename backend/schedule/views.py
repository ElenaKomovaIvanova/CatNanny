from datetime import date
from django.db.models import Q
from .models import UnavailablePeriod

def get_available_user_ids(start_date: date, end_date: date):
    """Возвращает список ID пользователей, доступных в указанный период."""
    unavailable_user_ids = UnavailablePeriod.objects.filter(
        Q(start_date__lte=end_date) & Q(end_date__gte=start_date) |  # Любое пересечение
        Q(start_date__gte=start_date) & Q(end_date__lte=end_date)    # Полностью внутри диапазона
    ).values_list('user', flat=True)

    # Возвращаем список доступных пользователей, исключая недоступных
    return unavailable_user_ids
