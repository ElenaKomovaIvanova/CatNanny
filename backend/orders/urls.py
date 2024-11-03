# orders/urls.py
from django.urls import path
from .views import OrdersListAPI, OrderDetailAPI, OrderCreateAPI, OrderUpdateStatusAPI

urlpatterns = [
    path('', OrdersListAPI.as_view(), name='orders_list_api'),
    path('<int:pk>/', OrderDetailAPI.as_view(), name='order_detail_api'),
    path('new/', OrderCreateAPI.as_view(), name='order_create_api'),
    path('updateStatus/', OrderUpdateStatusAPI.as_view(), name='order_update_status')
]
