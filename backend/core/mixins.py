from django.utils import timezone


class TimestampMixin:

    def update_timestamp(self):
        """Update the timestamp field."""
        if hasattr(self, 'updated_at'):
            self.updated_at = timezone.now()
            self.save(update_fields=['updated_at'])


class LoggingMixin:
   
    def log_action(self, action, details=''):
        """Log an action with details."""
        import logging
        logger = logging.getLogger(self.__class__.__module__)
        logger.info(f"{action}: {details}")
