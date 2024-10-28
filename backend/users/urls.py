from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ProfileCreateView, ProfileView, NanniesListAPI

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/update/', ProfileCreateView.as_view(), name='profile-update'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('nannies/', NanniesListAPI.as_view(), name='nannies'),
]