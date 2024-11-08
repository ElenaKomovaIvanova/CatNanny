from django.urls import path
from .views import VisitListCreateAPI

urlpatterns = [
    path('', VisitListCreateAPI.as_view(), name='visit-list-create'),
]
