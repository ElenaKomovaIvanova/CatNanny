# chat/urls.py
from django.urls import path
from .views import send_chat_message
from .views import get_chat_messages

urlpatterns = [
    path('send-message/', send_chat_message, name='send_chat_message'),
    path('messages/<int:order>/', get_chat_messages, name='get_chat_messages'),
]
