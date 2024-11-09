from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ProfileCreateView, ProfileView, NanniesListAPI, upload_image
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/update/', ProfileCreateView.as_view(), name='profile-update'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<int:id>/', ProfileView.as_view(), name='user-profile-by-id'),
    path('nannies/', NanniesListAPI.as_view(), name='nannies'),
    path('upload-image/', upload_image, name='upload_image'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]