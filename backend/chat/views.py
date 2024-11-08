# chat/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ChatMessage
from .serializers import ChatMessageSerializer  # Убедитесь, что вы создали сериализатор

@api_view(['POST'])
def send_chat_message(request):
    serializer = ChatMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Сохраняем сообщение в базе данных
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_chat_messages(request, order):
    messages = ChatMessage.objects.filter(order=order).order_by('timestamp')
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)