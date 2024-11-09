import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from chat.consumers import OrderChatConsumer


print("Starting ASGI application...")  # Должно печататься в консоли

application = ProtocolTypeRouter({
    "http": django_asgi_app,  # Обработка обычных HTTP-запросов
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/order_chat/<int:order>/', OrderChatConsumer.as_asgi()),
        ])
    ),
})

print("ASGI application created.")  # Должно печататься в консоли
