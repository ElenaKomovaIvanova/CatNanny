from django.urls import path
from .views import UnavailablePeriodCreateAPI, AvailabilityManager, UnavailablePeriodListAPI

urlpatterns = [
    # path('available-users/', AvailabilityManager.as_view(), name='available_users'),
    path('unavailable_periods/', UnavailablePeriodCreateAPI.as_view(), name='unavailable_periods_create'),
    path('unavailable_periods/list/', UnavailablePeriodListAPI.as_view(), name='unavailable_periods_list'),
]
