
from rest_framework import serializers

from users.models import Profile
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    catnanny = serializers.IntegerField(source='catnanny_id')

    class Meta:
        model = Review
        fields = ['catnanny', 'review', 'rating', 'owner', 'created_at', 'id']

    def get_owner(self, obj):
        return {
            'id': obj.owner.user.id,
            'first_name': obj.owner.user.first_name,
            'last_name': obj.owner.user.last_name,
        }

    def get_catnanny(self, obj):
        return {
            'id': obj.catnanny.user.id,
            'first_name': obj.catnanny.user.first_name,
            'last_name': obj.catnanny.user.last_name,
        }

def create(self, validated_data):
    # Извлекаем данные о котоняни
    catnanny_id = validated_data.pop('catnanny', None)

    # Создаем объект отзыва с оставшимися данными
    review = super().create(validated_data)

    # Если ID котоняни был предоставлен, устанавливаем связь
    if catnanny_id is not None:
        try:
            catnanny = Profile.objects.get(id=catnanny_id)  # Получаем объект котоняни по ID
            review.catnanny = catnanny  # Устанавливаем объект котоняни
            review.save()  # Сохраняем объект отзыва с обновленным полем catnanny
        except Profile.DoesNotExist:
            raise serializers.ValidationError(f"Catnanny with id {catnanny_id} does not exist.")

    return review
