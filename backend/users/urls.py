from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ProfileCreateView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/update/', ProfileCreateView.as_view(), name='profile-update'),
    path('profile/', ProfileView.as_view(), name='profile')
]