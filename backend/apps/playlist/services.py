from apps.playlist.models import PlaylistTrack
from django.conf import settings
from functools import wraps
import logging

logger = logging.getLogger(__name__)


def validate_position_params(func):
    @wraps(func)
    def wrapper(prev_position=None, next_position=None):
        if prev_position is not None and prev_position < 0:
            raise ValueError("Previous position cannot be negative")
        if next_position is not None and next_position < 0:
            raise ValueError("Next position cannot be negative")
        if prev_position is not None and next_position is not None:
            if prev_position >= next_position:
                raise ValueError("Previous position must be less than next position")
        
        return func(prev_position, next_position)
    return wrapper


@validate_position_params
def calculate_position(prev_position=None, next_position=None):
    if prev_position is None and next_position is None:
        logger.debug("Calculating position for first track")
        return 1.0
    
    if prev_position is None:
        logger.debug(f"Calculating position before {next_position}")
        return next_position - 1
    
    if next_position is None:
        logger.debug(f"Calculating position after {prev_position}")
        return prev_position + 1
    
    new_position = (prev_position + next_position) / 2
    logger.debug(f"Calculating position between {prev_position} and {next_position}: {new_position}")
    return new_position


def auto_reorder_by_votes(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)

        if getattr(settings, 'AUTO_SORT_BY_VOTES', False):
            
            tracks = PlaylistTrack.objects.order_by('-votes', 'position')
            for idx, track in enumerate(tracks, start=1):
                track.position = float(idx)
            
            PlaylistTrack.objects.bulk_update(tracks, ['position'])
            logger.info("Playlist automatically reordered by votes")
        
        return result
    return wrapper
