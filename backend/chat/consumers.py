from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json
from .models import ChatMessage
from orders.models import Orders
from users.models import Profile

class OrderChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.order = self.scope['url_route']['kwargs']['order']
        self.order_group_name = f'order_chat_{self.order}'

        await self.channel_layer.group_add(
            self.order_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.order_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        order_id = text_data_json['order']
        sender_id = text_data_json['sender']
        message_text = text_data_json['message']
        timestamp = text_data_json['timestamp']

        # Ищем объекты Orders и Profile асинхронно
        order_instance = await sync_to_async(Orders.objects.get)(id=order_id)
        sender_profile = await sync_to_async(Profile.objects.get)(id=sender_id)

        # Получаем имя пользователя асинхронно
        sender_username = await sync_to_async(lambda: sender_profile.user.username)()

        # Создаем сообщение и сохраняем его в базе данных
        message_data = {
            'order': order_instance,
            'sender': sender_profile,
            'message': message_text,
            'timestamp': timestamp,
        }

        new_message = await sync_to_async(ChatMessage.objects.create)(**message_data)

        # Подготовка данных для отправки через WebSocket
        serialized_message = {
            'order': new_message.order.id,
            'sender': new_message.sender.id,
            'sender_name': sender_username,
            'message': new_message.message,
            'timestamp': new_message.timestamp.isoformat(),
        }

        # Отправка сообщения всем участникам чата через WebSocket
        await self.channel_layer.group_send(
            self.order_group_name,
            {
                'type': 'chat_message',
                'message': serialized_message,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))
