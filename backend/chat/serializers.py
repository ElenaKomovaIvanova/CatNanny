from rest_framework import serializers
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):

    sender_name = serializers.CharField(source='sender.user.first_name', read_only=True)


    class Meta:
        model = ChatMessage
        fields = ['id', 'order', 'sender', 'sender_name', 'message', 'timestamp']
