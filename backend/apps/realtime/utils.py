from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)


def broadcast_playlist_event(event_type, payload):
    channel_layer = get_channel_layer()
    
    event_data = {
        'type': 'playlist_update',
        'data': {
            'type': event_type,
            'payload': payload
        }
    }
    
    try:
        async_to_sync(channel_layer.group_send)(
            'playlist_updates',
            event_data
        )
        logger.info(f"Broadcasted event: {event_type}")
    except Exception as e:
        logger.error(f"Failed to broadcast event {event_type}: {str(e)}")


def send_heartbeat():
    from datetime import datetime
    
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        'playlist_updates',
        {
            'type': 'playlist_update',
            'data': {
                'type': 'ping',
                'ts': datetime.utcnow().isoformat() + 'Z'
            }
        }
    )
