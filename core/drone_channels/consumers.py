import json
from .db_operations import update_drone_position, complete_route
from channels.generic.websocket import AsyncWebsocketConsumer

class DroneConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["uuid"]
        print(self.room_name)
        # Join room group
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        json_data = json.loads(text_data)
        latitude = json_data['lat']
        longitude = json_data['lng']
        drone_tracker = json_data['drone_tracker']
        action = json_data.get('action', None)
        
        if latitude and longitude and drone_tracker:
            await update_drone_position(self.room_name, latitude, longitude, drone_tracker)
            
        if action == 'complete_route':
            await complete_route(self.room_name)
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_name, {"type": "chat.message", "response": json_data}
        )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event['response']))