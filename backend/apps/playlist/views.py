from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import PlaylistTrack
from .serializers import PlaylistTrackSerializer, VoteSerializer
from .services import calculate_position
import logging

logger = logging.getLogger(__name__)


class PlaylistViewSet(viewsets.ModelViewSet):

    queryset = PlaylistTrack.objects.select_related('track').all()
    serializer_class = PlaylistTrackSerializer
    
    def get_queryset(self):
        """Get playlist ordered by position."""
        return super().get_queryset().order_by('position')
    
    @swagger_auto_schema(
        operation_summary="Add track to playlist",
        operation_description="""
        Add a new track to the playlist. The position is automatically calculated
        and appended to the end of the playlist.
        
        **Note**: Duplicate tracks are not allowed. If the track already exists in 
        the playlist, a 400 error will be returned.
        
        **Real-time**: Broadcasts 'track.added' event to all WebSocket clients.
        """,
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['track_id'],
            properties={
                'track_id': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description='ID of the track to add'
                ),
                'added_by': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Username of the person adding the track',
                    default='Anonymous'
                ),
            },
        ),
        responses={
            201: PlaylistTrackSerializer,
            400: 'Bad Request - Track already in playlist or invalid track_id'
        }
    )
    @transaction.atomic
    def create(self, request):
        from apps.realtime.utils import broadcast_playlist_event
        
        # Get track_id from either 'track_id' or 'track' field
        track_id = request.data.get('track_id') or request.data.get('track')
        added_by = request.data.get('added_by', 'Anonymous')
        
        if not track_id:
            raise ValidationError({
                'error': {
                    'code': 'MISSING_TRACK_ID',
                    'message': 'track_id or track field is required',
                }
            })
        
        # Check for duplicate
        if PlaylistTrack.objects.filter(track_id=track_id).exists():
            raise ValidationError({
                'error': {
                    'code': 'DUPLICATE_TRACK',
                    'message': 'This track is already in the playlist',
                    'details': {'track_id': track_id}
                }
            })
        
        # Calculate position from request or append to end
        position = request.data.get('position')
        if position is None:
            last_track = PlaylistTrack.objects.order_by('-position').first()
            position = calculate_position(
                prev_position=last_track.position if last_track else None,
                next_position=None
            )
        
        # Create playlist track using serializer
        serializer = self.get_serializer(data={
            'track_id': track_id,
            'position': position,
            'added_by': added_by
        })
        serializer.is_valid(raise_exception=True)
        playlist_track = serializer.save()
        
        broadcast_playlist_event('track.added', serializer.data)
        
        logger.info(f"Track {track_id} added to playlist by {added_by}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @swagger_auto_schema(
        operation_summary="Update track position or playing state",
        operation_description="""
        Update a playlist track's position or set it as the currently playing track.
        
        **Position Update**: Used for drag-and-drop reordering. The position is calculated
        using the formula: `(prevPosition + nextPosition) / 2`
        
        **Playing State**: Only one track can be playing at a time. Setting `is_playing=true`
        will automatically set all other tracks to `is_playing=false`.
        
        **Real-time**: Broadcasts 'track.moved' or 'track.playing' event to WebSocket clients.
        """,
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'position': openapi.Schema(
                    type=openapi.TYPE_NUMBER,
                    description='New position for the track (calculated from drag-and-drop)',
                    example=2.5
                ),
                'is_playing': openapi.Schema(
                    type=openapi.TYPE_BOOLEAN,
                    description='Set track as currently playing',
                    example=True
                ),
            },
        ),
        responses={200: PlaylistTrackSerializer}
    )
    @transaction.atomic
    def partial_update(self, request, pk=None):
        from apps.realtime.utils import broadcast_playlist_event
        
        instance = self.get_object()
        
        # Handle is_playing state
        if 'is_playing' in request.data and request.data['is_playing']:
            # Ensure only one track is playing
            PlaylistTrack.objects.exclude(pk=instance.pk).update(is_playing=False)
            instance.is_playing = True
            
            from django.utils import timezone
            instance.played_at = timezone.now()
            
            broadcast_playlist_event('track.playing', {'id': instance.id})
        
        # Handle position update
        if 'position' in request.data:
            instance.position = request.data['position']
            instance.save()
            
            serializer = self.get_serializer(instance)
            broadcast_playlist_event('track.moved', serializer.data)
        else:
            instance.save()
        
        serializer = self.get_serializer(instance)
        logger.info(f"Track {instance.id} updated")
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_summary="Remove track from playlist",
        operation_description="""
        Delete a track from the playlist.
        
        **Real-time**: Broadcasts 'track.removed' event to all WebSocket clients.
        """,
        responses={
            204: 'No Content - Track successfully removed',
            404: 'Not Found - Track does not exist'
        }
    )
    @transaction.atomic
    def destroy(self, request, pk=None):
        """Remove track from playlist."""
        from apps.realtime.utils import broadcast_playlist_event
        
        instance = self.get_object()
        track_id = instance.id
        instance.delete()
        
        # Broadcast removal event
        broadcast_playlist_event('track.removed', {'id': track_id})
        
        logger.info(f"Track {track_id} removed from playlist")
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @swagger_auto_schema(
        operation_summary="Vote on a track",
        operation_description="""
        Upvote or downvote a track in the playlist.
        
        Vote counts can be positive or negative. Each vote increments or decrements
        the vote count by 1.
        
        **Rate Limiting**: Maximum 5 votes per 10 seconds per user (based on IP).
        
        **Real-time**: Broadcasts 'track.voted' event to all WebSocket clients.
        """,
        request_body=VoteSerializer,
        responses={
            200: PlaylistTrackSerializer,
            429: 'Too Many Requests - Rate limit exceeded'
        }
    )
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def vote(self, request, pk=None):
        """
        Vote on a track (upvote or downvote).
        Includes rate limiting via decorator.
        """
        from apps.realtime.utils import broadcast_playlist_event
        
        instance = self.get_object()
        vote_serializer = VoteSerializer(data=request.data)
        vote_serializer.is_valid(raise_exception=True)
        
        direction = vote_serializer.validated_data['direction']
        
        # Update votes
        if direction == 'up':
            instance.votes += 1
        elif direction == 'down':
            instance.votes -= 1
        
        instance.save()
        
        serializer = self.get_serializer(instance)
        
        # Broadcast vote event
        broadcast_playlist_event('track.voted', serializer.data)
        
        logger.info(f"Track {instance.id} voted {direction}")
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_summary="Play a track",
        operation_description="""
        Set a track as currently playing. Only one track can be playing at a time.
        All other tracks will be set to not playing.
        
        **Real-time**: Broadcasts 'track.playing' event to all WebSocket clients.
        """,
        responses={
            200: PlaylistTrackSerializer,
            404: 'Not Found - Track does not exist'
        }
    )
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def play(self, request, pk=None):
        """Set track as currently playing."""
        from apps.realtime.utils import broadcast_playlist_event
        from django.utils import timezone
        
        # Stop all currently playing tracks
        PlaylistTrack.objects.filter(is_playing=True).update(is_playing=False)
        
        # Set this track as playing
        instance = self.get_object()
        instance.is_playing = True
        instance.played_at = timezone.now()
        instance.save()
        
        serializer = self.get_serializer(instance)
        
        # Broadcast play event
        broadcast_playlist_event('track.playing', serializer.data)
        
        logger.info(f"Track {instance.id} is now playing")
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_summary="Stop playback",
        operation_description="""
        Stop the currently playing track. Sets all tracks to not playing.
        
        **Real-time**: Broadcasts 'track.playing' event with is_playing=false.
        """,
        responses={200: 'OK - Playback stopped'}
    )
    @action(detail=False, methods=['post'])
    @transaction.atomic
    def stop(self, request):
        """Stop all playback."""
        from apps.realtime.utils import broadcast_playlist_event
        
        # Stop all currently playing tracks
        playing_tracks = PlaylistTrack.objects.filter(is_playing=True)
        if playing_tracks.exists():
            track_ids = list(playing_tracks.values_list('id', flat=True))
            playing_tracks.update(is_playing=False)
            
            # Broadcast stop event for each track
            for track_id in track_ids:
                broadcast_playlist_event('track.playing', {
                    'id': track_id,
                    'is_playing': False
                })
            
            logger.info(f"Stopped playback for {len(track_ids)} track(s)")
        
        return Response({'status': 'stopped'})
    
    @swagger_auto_schema(
        operation_summary="Get playlist history",
        operation_description="""
        Retrieve the 20 most recently played tracks from the playlist.
        
        Tracks are ordered by `played_at` timestamp in descending order.
        Only tracks that have been played (have a `played_at` value) are returned.
        """,
        responses={200: PlaylistTrackSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get recently played tracks."""
        played_tracks = PlaylistTrack.objects.filter(
            played_at__isnull=False
        ).order_by('-played_at')[:20]
        
        serializer = self.get_serializer(played_tracks, many=True)
        logger.info("Fetched playlist history")
        return Response(serializer.data)
