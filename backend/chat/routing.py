from django.urls import re_path
from . import consumers  # Импортируйте consumers из текущего приложения

websocket_urlpatterns = [
    re_path(r'ws/order_chat/(?P<order>\d+)/$', consumers.OrderChatConsumer.as_asgi()),  # Замените ChatMessage на ChatConsumer
]