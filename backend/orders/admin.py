from django.contrib import admin
from .models import Orders  # Импорт модели Orders


# Register the Orders model
@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Orders._meta.fields]  # Отображает все поля модели
    search_fields = ['owner__username', 'catnanny__username', 'cat_name']  # Поля для поиска
