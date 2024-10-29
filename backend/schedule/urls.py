from django.urls import path
from .views import AvailableUsersView

urlpatterns = [
    path('available-users/', AvailableUsersView.as_view(), name='available_users')
]
