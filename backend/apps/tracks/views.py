"""
Views for Track API endpoints.
"""
from rest_framework import viewsets, filters
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Track
from .serializers import TrackSerializer
import logging

logger = logging.getLogger(__name__)


class TrackViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'artist', 'album']
    ordering_fields = ['title', 'artist', 'duration_seconds', 'created_at']
    
    @swagger_auto_schema(
        operation_summary="List all tracks",
        operation_description="""
        Get a list of all available tracks in the library.
        
        **Search**: Use `?search=query` to search by title, artist, or album.
        
        **Ordering**: Use `?ordering=field` to sort results. Prefix with `-` for descending order.
        Available fields: `title`, `artist`, `duration_seconds`, `created_at`
        
        **Examples**:
        - `/api/tracks/?search=queen` - Search for "queen"
        - `/api/tracks/?ordering=-duration_seconds` - Sort by duration (longest first)
        - `/api/tracks/?ordering=artist` - Sort by artist name (A-Z)
        """,
        manual_parameters=[
            openapi.Parameter(
                'search',
                openapi.IN_QUERY,
                description="Search by title, artist, or album",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                'ordering',
                openapi.IN_QUERY,
                description="Order results by field (prefix with - for descending)",
                type=openapi.TYPE_STRING,
                enum=['title', '-title', 'artist', '-artist', 'duration_seconds', '-duration_seconds']
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        logger.info(f"Fetching track library (filters: {request.query_params})")
        return super().list(request, *args, **kwargs)
