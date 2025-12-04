"""
Reusable mixins for views and models.
"""
from django.utils import timezone


class TimestampMixin:
    """Mixin to add timestamp functionality to models."""
    
    def update_timestamp(self):
        """Update the timestamp field."""
        if hasattr(self, 'updated_at'):
            self.updated_at = timezone.now()
            self.save(update_fields=['updated_at'])


class LoggingMixin:
    """Mixin to add logging to views."""
    
    def log_action(self, action, details=''):
        """Log an action with details."""
        import logging
        logger = logging.getLogger(self.__class__.__module__)
        logger.info(f"{action}: {details}")
