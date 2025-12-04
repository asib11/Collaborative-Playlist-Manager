"""
Main URL configuration for playlist manager project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger/OpenAPI schema configuration
schema_view = get_schema_view(
    openapi.Info(
        title="Realtime Collaborative Playlist API",
        default_version='v1',
        description="""
## Realtime Collaborative Playlist Manager API

A collaborative playlist application with real-time synchronization.

### Features:
- **Track Library**: Browse and search available music tracks
- **Playlist Management**: Add, remove, reorder tracks
- **Voting System**: Upvote/downvote tracks in the playlist
- **Real-time Sync**: WebSocket support for live updates
- **Position Algorithm**: Efficient reordering without re-indexing

### WebSocket Connection:
- **Endpoint**: `ws://localhost:8000/ws/playlist/`
- **Events**: track.added, track.removed, track.moved, track.voted, track.playing

### Authentication:
No authentication required for this demo version.
        """,
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.tracks.urls')),
    path('api/', include('apps.playlist.urls')),
    
    # Swagger/OpenAPI documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui-root'),  # Root redirects to Swagger
]
