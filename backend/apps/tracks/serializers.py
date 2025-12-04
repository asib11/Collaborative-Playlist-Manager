from rest_framework import serializers
from .models import Track


class TrackSerializer(serializers.ModelSerializer):
    
    duration_formatted = serializers.ReadOnlyField()
    
    class Meta:
        model = Track
        fields = [
            'id',
            'title',
            'artist',
            'album',
            'duration_seconds',
            'duration_formatted',
            'genre',
            'cover_url',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
