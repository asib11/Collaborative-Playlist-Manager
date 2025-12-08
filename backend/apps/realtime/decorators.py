from functools import wraps
import logging

logger = logging.getLogger(__name__)


def require_websocket_connection(func):
    @wraps(func)
    async def wrapper(self, *args, **kwargs):
        if not hasattr(self, 'channel_name'):
            logger.error("No active WebSocket connection")
            return None
        return await func(self, *args, **kwargs)
    return wrapper
