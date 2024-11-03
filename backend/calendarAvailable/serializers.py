from rest_framework import serializers
from .models import UnavailablePeriod

class UnavailablePeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailablePeriod
        fields = ['id', 'user', 'start_date', 'end_date', 'created_at']
        read_only_fields = ['created_at']  # created_at будет только для чтения

    def validate(self, data):
        if data['end_date'] < data['start_date']:
            raise serializers.ValidationError("End date cannot be before start date.")
        return data


class UnavailablePeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailablePeriod
        fields = ['start_date', 'end_date']