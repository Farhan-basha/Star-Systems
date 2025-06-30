from django.test import TestCase

# Create your tests here.
import websockets
import asyncio
import json

async def test_websocket():
    uri = "ws://localhost:8000/ws/chat/general/"
    async with websockets.connect(uri) as websocket:
        # Send a message
        await websocket.send(json.dumps({
            "message": "Hello from test client"
        }))
        
        # Receive messages
        while True:
            response = await websocket.recv()
            print(f"Received: {response}")

asyncio.get_event_loop().run_until_complete(test_websocket())