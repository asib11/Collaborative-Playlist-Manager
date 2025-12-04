from django.apps import AppConfig


class PlaylistConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.playlist'
    
    def ready(self):
        """Import signals when app is ready."""
        import apps.playlist.signals  # noqa
