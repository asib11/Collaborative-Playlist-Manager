from channels.generic.websocket import AsyncJsonWebsocketConsumer
from apps.realtime.decorators import require_websocket_connection
import logging

logger = logging.getLogger(__name__)


class PlaylistConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.room_group_name = 'playlist_updates'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        logger.info(f"WebSocket connected: {self.channel_name}")
        
        # Send initial connection confirmation
        await self.send_json({
            'type': 'connection.established',
            'message': 'Connected to playlist updates'
        })
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        logger.info(f"WebSocket disconnected: {self.channel_name} (code: {close_code})")
    
    @require_websocket_connection
    async def receive_json(self, content):
        message_type = content.get('type')
        
        if message_type == 'ping':
            await self.send_json({
                'type': 'pong',
                'ts': content.get('ts')
            })
            logger.debug(f"Responded to ping from {self.channel_name}")
    
    async def playlist_update(self, event):
        await self.send_json(event['data'])
        logger.debug(f"Sent playlist update: {event['data'].get('type')}")
