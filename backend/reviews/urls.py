
from django.urls import path
from .views import ReviewCreateAPI, UserReviewsListAPI, ReviewDetailAPI

urlpatterns = [
    path('new/', ReviewCreateAPI.as_view(), name='create_review'),
    path('list/', UserReviewsListAPI.as_view(), name='list_reviews'),
    path('<int:pk>/', ReviewDetailAPI.as_view(), name='review_detail_api'),
]
