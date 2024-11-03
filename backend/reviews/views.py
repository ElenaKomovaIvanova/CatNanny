from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from users.models import Profile
from .models import Review
from .serializers import ReviewSerializer

class ReviewCreateAPI(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        if not serializer.is_valid():
            print("Errors:", serializer.errors)  # Печатаем ошибки сериализатора
        else:
            profile = Profile.objects.get(user=self.request.user)
            serializer.save(owner=profile)


class UserReviewsListAPI(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Возвращаем отзывы для текущего пользователя
        return Review.objects.filter(owner__user=self.request.user) | Review.objects.filter(catnanny__user=self.request.user)

class ReviewDetailAPI(generics.RetrieveUpdateDestroyAPIView):  # Изменено на RetrieveUpdateDestroyAPIView
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ограничиваем доступ только для заявок текущего пользователя
        user = self.request.user
        # Ограничиваем доступ для заказов, где текущий пользователь — либо владелец, либо котоняня
        return Review.objects.filter(Q(owner__user=user) | Q(catnanny__user=user))