"""
Tests for Playlist API views.
"""
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from apps.playlist.models import PlaylistTrack
from apps.tracks.models import Track


@pytest.mark.django_db
class TestPlaylistAPI:
    """Test cases for Playlist API endpoints."""
    
    @pytest.fixture
    def api_client(self):
        """Create API client for testing."""
        return APIClient()
    
    @pytest.fixture
    def sample_tracks(self):
        """Create sample tracks for testing."""
        tracks = []
        for i in range(3):
            track = Track.objects.create(
                title=f'Test Song {i}',
                artist=f'Test Artist {i}',
                album=f'Test Album {i}',
                duration_seconds=180 + i * 10,
                genre='rock'
            )
            tracks.append(track)
        return tracks
    
    def test_list_playlist(self, api_client, sample_tracks):
        """Test listing playlist items."""
        # Create playlist items
        PlaylistTrack.objects.create(
            track=sample_tracks[0],
            position=1.0,
        )
        
        response = api_client.get('/api/playlist/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
    
    def test_add_track_to_playlist(self, api_client, sample_tracks):
        """Test adding a track to the playlist."""
        data = {
            'track_id': sample_tracks[0].id,
            'added_by': 'TestUser'
        }
        
        response = api_client.post('/api/playlist/', data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['track']['id'] == sample_tracks[0].id
        assert response.data['position'] == 1.0
    
    def test_add_duplicate_track_fails(self, api_client, sample_tracks):
        """Test that adding duplicate track fails."""
        PlaylistTrack.objects.create(
            track=sample_tracks[0],
            position=1.0,
        )
        
        data = {
            'track_id': sample_tracks[0].id,
            'added_by': 'TestUser'
        }
        
        response = api_client.post('/api/playlist/', data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_vote_on_track(self, api_client, sample_tracks):
        """Test voting on a track."""
        playlist_track = PlaylistTrack.objects.create(
            track=sample_tracks[0],
            position=1.0,
        )
        
        # Upvote
        response = api_client.post(
            f'/api/playlist/{playlist_track.id}/vote/',
            {'direction': 'up'},
            format='json'
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['votes'] == 1
        
        # Downvote
        response = api_client.post(
            f'/api/playlist/{playlist_track.id}/vote/',
            {'direction': 'down'},
            format='json'
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['votes'] == 0
    
    def test_remove_track(self, api_client, sample_tracks):
        """Test removing a track from playlist."""
        playlist_track = PlaylistTrack.objects.create(
            track=sample_tracks[0],
            position=1.0,
        )
        
        response = api_client.delete(f'/api/playlist/{playlist_track.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not PlaylistTrack.objects.filter(id=playlist_track.id).exists()
