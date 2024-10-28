# orders/urls.py
from django.urls import path
from .views import OrdersListAPI, OrderDetailAPI

urlpatterns = [
    path('', OrdersListAPI.as_view(), name='orders_list_api'),
    path('<int:pk>/', OrderDetailAPI.as_view(), name='order_detail_api'),
]
