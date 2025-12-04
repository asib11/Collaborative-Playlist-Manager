"""
Admin configuration for Track model.
"""
from django.contrib import admin
from .models import Track


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    """Admin interface for Track model."""
    
    list_display = ['title', 'artist', 'album', 'genre', 'duration_formatted']
    list_filter = ['genre', 'artist']
    search_fields = ['title', 'artist', 'album']
    ordering = ['artist', 'title']
