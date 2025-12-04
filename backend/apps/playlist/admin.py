from django.contrib import admin
from .models import PlaylistTrack


@admin.register(PlaylistTrack)
class PlaylistTrackAdmin(admin.ModelAdmin):
    """Admin interface for PlaylistTrack model."""
    
    list_display = ['track', 'position', 'votes', 'added_by', 'is_playing', 'added_at']
    list_filter = ['is_playing', 'added_by']
    search_fields = ['track__title', 'track__artist', 'added_by']
    ordering = ['position']
    readonly_fields = ['added_at', 'played_at']
