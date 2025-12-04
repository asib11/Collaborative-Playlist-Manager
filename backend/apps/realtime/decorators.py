"""
Decorators for enhancing functionality using the Decorator Design Pattern.
"""
from functools import wraps
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.exceptions import ValidationError, Throttled
from collections import defaultdict
import time
import logging

logger = logging.getLogger(__name__)


def broadcast_event(event_type):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Execute original function
            result = func(*args, **kwargs)
            
            # Broadcast to WebSocket group
            channel_layer = get_channel_layer()
            event_data = {
                'type': 'playlist_update',
                'data': {
                    'type': event_type,
                    'payload': result
                }
            }
            
            async_to_sync(channel_layer.group_send)(
                'playlist_updates',
                event_data
            )
            
            logger.info(f"Broadcasted event: {event_type}")
            return result
        return wrapper
    return decorator


def validate_playing_state(func):
    @wraps(func)
    def wrapper(instance, *args, **kwargs):
        from apps.playlist.models import PlaylistTrack
        
        # If setting a track to playing, disable all others
        if kwargs.get('is_playing', False) or (
            len(args) > 0 and hasattr(args[0], 'get') and args[0].get('is_playing')
        ):
            PlaylistTrack.objects.exclude(pk=instance.pk).update(is_playing=False)
        
        return func(instance, *args, **kwargs)
    return wrapper


def prevent_duplicate_track(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        from apps.playlist.models import PlaylistTrack
        
        # Extract track_id from request data
        request = args[1] if len(args) > 1 else kwargs.get('request')
        track_id = request.data.get('track_id')
        
        if PlaylistTrack.objects.filter(track_id=track_id).exists():
            raise ValidationError({
                'error': {
                    'code': 'DUPLICATE_TRACK',
                    'message': 'This track is already in the playlist',
                    'details': {'track_id': track_id}
                }
            })
        
        return func(*args, **kwargs)
    return wrapper


def log_action(action_name):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"Action started: {action_name}")
            try:
                result = func(*args, **kwargs)
                logger.info(f"Action completed: {action_name}")
                return result
            except Exception as e:
                logger.error(f"Action failed: {action_name} - {str(e)}")
                raise
        return wrapper
    return decorator


def rate_limit(max_calls=10, period=60):
    call_history = defaultdict(list)
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            request = args[1] if len(args) > 1 else kwargs.get('request')
            
            # Use IP address as identifier (or user_id if authenticated)
            user_id = getattr(request, 'user_id', None)
            if not user_id:
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    user_id = x_forwarded_for.split(',')[0]
                else:
                    user_id = request.META.get('REMOTE_ADDR', 'anonymous')
            
            current_time = time.time()
            
            # Clean old calls
            call_history[user_id] = [
                t for t in call_history[user_id] 
                if current_time - t < period
            ]
            
            if len(call_history[user_id]) >= max_calls:
                raise Throttled(
                    detail=f"Rate limit exceeded. Max {max_calls} calls per {period}s"
                )
            
            call_history[user_id].append(current_time)
            return func(*args, **kwargs)
        return wrapper
    return decorator


def require_websocket_connection(func):
    @wraps(func)
    async def wrapper(self, *args, **kwargs):
        if not hasattr(self, 'channel_name'):
            logger.error("No active WebSocket connection")
            return None
        return await func(self, *args, **kwargs)
    return wrapper


def cache_result(timeout=300):
    from django.core.cache import cache
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__module__}.{func.__name__}:{str(args)}:{str(kwargs)}"
            result = cache.get(cache_key)
            
            if result is None:
                result = func(*args, **kwargs)
                cache.set(cache_key, result, timeout)
                logger.debug(f"Cached result for {func.__name__}")
            else:
                logger.debug(f"Retrieved cached result for {func.__name__}")
            
            return result
        return wrapper
    return decorator
