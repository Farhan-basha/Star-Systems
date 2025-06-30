import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        # Reject connection if not authenticated
        if self.scope["user"] is None or isinstance(self.scope["user"], AnonymousUser):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            # WebRTC signaling support
            if data.get("type") in ["webrtc_offer", "webrtc_answer", "webrtc_ice_candidate"]:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "webrtc_signal",
                        "message": data,
                        "sender_channel": self.channel_name
                    }
                )
            else:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message": data
                    }
                )
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    async def webrtc_signal(self, event):
        # Don't send the signal back to the sender
        if event.get("sender_channel") != self.channel_name:
            await self.send(text_data=json.dumps(event["message"]))

class DirectMessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.room_group_name = f"dm_{self.group_id}"

        # Reject connection if not authenticated
        if self.scope["user"] is None or isinstance(self.scope["user"], AnonymousUser):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            # WebRTC signaling support
            if data.get("type") in ["webrtc_offer", "webrtc_answer", "webrtc_ice_candidate"]:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "webrtc_signal",
                        "message": data,
                        "sender_channel": self.channel_name
                    }
                )
            else:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message": data
                    }
                )
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    async def webrtc_signal(self, event):
        if event.get("sender_channel") != self.channel_name:
            await self.send(text_data=json.dumps(event["message"]))

class ChannelConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.channel_id = self.scope['url_route']['kwargs']['channel_id']
        self.room_group_name = f"channel_{self.channel_id}"

        # Reject connection if not authenticated
        if self.scope["user"] is None or isinstance(self.scope["user"], AnonymousUser):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            # WebRTC signaling support
            if data.get("type") in ["webrtc_offer", "webrtc_answer", "webrtc_ice_candidate"]:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "webrtc_signal",
                        "message": data,
                        "sender_channel": self.channel_name
                    }
                )
            else:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message": data
                    }
                )
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    async def webrtc_signal(self, event):
        if event.get("sender_channel") != self.channel_name:
            await self.send(text_data=json.dumps(event["message"]))
