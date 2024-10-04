import json
from .db_operations import update_drone_position, complete_route
from channels.generic.websocket import AsyncWebsocketConsumer

import logging
logger = logging.getLogger(__name__)


class DroneConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["uuid"]
        logger.info(f"Connecting to room: {self.room_name}")
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        logger.info(f"Disconnecting from room: {self.room_name}")
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        try:
            json_data = json.loads(text_data)
            latitude = json_data.get('lat')
            longitude = json_data.get('lng')
            drone_tracker = json_data.get('drone_tracker')
            action = json_data.get('action')

            response = {"status": "error", "message": "Invalid data"}

            if latitude and longitude and drone_tracker:
                drone, updated_lat, updated_lng = await update_drone_position(self.room_name, latitude, longitude, drone_tracker)
                if drone:
                    response = {
                        "status": "success",
                        "message": "Position updated",
                        "lat": updated_lat,
                        "lng": updated_lng
                    }
                else:
                    response = {"status": "error", "message": "Failed to update position"}

            if action == 'complete_route':
                drone = await complete_route(self.room_name)
                if drone:
                    response = {"status": "success", "message": "Route completed"}
                else:
                    response = {"status": "error", "message": "Failed to complete route"}

            await self.channel_layer.group_send(
                self.room_name, {"type": "chat.message", "response": response}
            )
        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
            await self.send(text_data=json.dumps({"status": "error", "message": "Invalid JSON"}))
        except Exception as e:
            logger.error(f"Unexpected error in receive: {e}")
            await self.send(text_data=json.dumps({"status": "error", "message": "Server error"}))


    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['response']))