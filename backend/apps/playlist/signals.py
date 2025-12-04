from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import PlaylistTrack
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=PlaylistTrack)
def playlist_track_saved(sender, instance, created, **kwargs):
    if created:
        logger.info(f"PlaylistTrack created: {instance.track.title} by {instance.added_by}")
    else:
        logger.debug(f"PlaylistTrack updated: {instance.track.title}")


@receiver(post_delete, sender=PlaylistTrack)
def playlist_track_deleted(sender, instance, **kwargs):
    logger.info(f"PlaylistTrack deleted: {instance.track.title}")
