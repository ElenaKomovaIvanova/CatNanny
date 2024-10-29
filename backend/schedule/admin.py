from django.contrib import admin

from schedule.models import UnavailablePeriod


# Register the Orders model
@admin.register(UnavailablePeriod)
class OrdersAdmin(admin.ModelAdmin):
    list_display = [field.name for field in UnavailablePeriod._meta.fields]  # Отображает все поля модели
    search_fields = ['user', 'start_date', 'end_date']  # Поля для поиска
