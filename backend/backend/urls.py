from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/calendarAvailable/', include('calendarAvailable.urls')),
    path('api/reviews/', include('reviews.urls')),
]
