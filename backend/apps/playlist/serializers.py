from rest_framework import serializers
from .models import PlaylistTrack
from apps.tracks.serializers import TrackSerializer
from apps.tracks.models import Track

class PlaylistTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer(read_only=True)
    track_id = serializers.PrimaryKeyRelatedField(
        queryset=PlaylistTrack.objects.none(),
        source='track',
        write_only=True
    )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['track_id'].queryset = Track.objects.all()
    
    class Meta:
        model = PlaylistTrack
        fields = [
            'id',
            'track',
            'track_id',
            'position',
            'votes',
            'added_by',
            'added_at',
            'is_playing',
            'played_at',
        ]
        read_only_fields = ['id', 'added_at', 'played_at']


class VoteSerializer(serializers.Serializer):
    direction = serializers.ChoiceField(choices=['up', 'down'])
