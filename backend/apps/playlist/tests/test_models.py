"""
Tests for PlaylistTrack model.
"""
import pytest
from django.core.exceptions import ValidationError
from apps.playlist.models import PlaylistTrack
from apps.tracks.models import Track


@pytest.mark.django_db
class TestPlaylistTrackModel:
    """Test cases for PlaylistTrack model."""
    
    @pytest.fixture
    def sample_track(self):
        """Create a sample track for testing."""
        return Track.objects.create(
            title='Test Song',
            artist='Test Artist',
            album='Test Album',
            duration_seconds=180,
            genre='rock'
        )
    
    def test_create_playlist_track(self, sample_track):
        """Test creating a playlist track."""
        playlist_track = PlaylistTrack.objects.create(
            track=sample_track,
            position=1.0,
            added_by='TestUser'
        )
        assert playlist_track.id is not None
        assert playlist_track.track == sample_track
        assert playlist_track.position == 1.0
        assert playlist_track.votes == 0
    
    def test_duplicate_track_raises_error(self, sample_track):
        """Test that duplicate tracks raise validation error."""
        PlaylistTrack.objects.create(
            track=sample_track,
            position=1.0,
        )
        
        with pytest.raises(ValidationError):
            PlaylistTrack.objects.create(
                track=sample_track,
                position=2.0,
            )
    
    def test_set_as_playing(self, sample_track):
        """Test setting a track as playing."""
        # Create two tracks
        track1 = PlaylistTrack.objects.create(
            track=sample_track,
            position=1.0,
            is_playing=True
        )
        
        track2_data = Track.objects.create(
            title='Test Song 2',
            artist='Test Artist 2',
            album='Test Album 2',
            duration_seconds=200,
            genre='pop'
        )
        track2 = PlaylistTrack.objects.create(
            track=track2_data,
            position=2.0,
        )
        
        # Set track2 as playing
        track2.set_as_playing()
        
        # Refresh track1 from database
        track1.refresh_from_db()
        
        assert track2.is_playing is True
        assert track1.is_playing is False
        assert track2.played_at is not None
