from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/calendarAvailable/', include('calendarAvailable.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/visits/', include('visits.urls')),
    path('api/chat/', include('chat.urls')),
]