"""
Management command to seed initial playlist with sample tracks.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.playlist.models import PlaylistTrack
from apps.tracks.models import Track
import random


class Command(BaseCommand):
    help = 'Seed the playlist with initial tracks'
    
    def handle(self, *args, **kwargs):
        """Create sample playlist if it doesn't exist."""
        
        if PlaylistTrack.objects.exists():
            self.stdout.write(self.style.WARNING('Playlist already exists. Skipping seed.'))
            return
        
        # Ensure tracks exist
        if not Track.objects.exists():
            self.stdout.write(self.style.ERROR('No tracks found. Run seed_tracks first.'))
            return
        
        # Get random tracks
        all_tracks = list(Track.objects.all())
        selected_tracks = random.sample(all_tracks, min(10, len(all_tracks)))
        
        # Sample user names
        users = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank']
        
        playlist_items = []
        for idx, track in enumerate(selected_tracks, start=1):
            playlist_item = PlaylistTrack(
                track=track,
                position=float(idx),
                votes=random.randint(-2, 10),
                added_by=random.choice(users),
            )
            playlist_items.append(playlist_item)
        
        # Create all items
        PlaylistTrack.objects.bulk_create(playlist_items)
        
        # Set first track as playing
        if playlist_items:
            first_item = PlaylistTrack.objects.first()
            first_item.is_playing = True
            first_item.played_at = timezone.now()
            first_item.save()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created playlist with {len(playlist_items)} tracks')
        )
