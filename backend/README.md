# 🎵 Realtime Collaborative Playlist Manager - Backend

Django backend with WebSocket support for a real-time collaborative playlist application. Built with Django REST Framework, Django Channels, and Redis.

## ✨ Features

### Core Features
- **RESTful API**: Full CRUD operations for tracks and playlist management
- **Real-time WebSocket Sync**: Instant updates via Django Channels
- **Position Algorithm**: Efficient track reordering without re-indexing entire playlist
- **Voting System**: Upvote/downvote tracks with real-time synchronization
- **Duplicate Prevention**: Automatic validation prevents duplicate tracks
- **Track Library**: Pre-seeded with 35 diverse tracks across multiple genres
- **Comprehensive Tests**: Unit tests for models, views, services, and WebSocket events

### Design Patterns
- **Decorator Pattern**: Reusable decorators for broadcasting, validation, logging
- **Service Layer**: Business logic separated from views
- **Signal Handlers**: Automatic event broadcasting on model changes
- **ASGI Support**: WebSocket support via Daphne ASGI server

## 🛠️ Tech Stack

- **Django 5.0** - Web framework
- **Django REST Framework 3.14** - REST API toolkit
- **Django Channels 4.0** - WebSocket support (ASGI)
- **Redis 7** - Channel layer backend for WebSockets
- **Daphne** - ASGI server for WebSocket connections
- **SQLite** - Database (can be upgraded to PostgreSQL)
- **Pytest** - Testing framework

## 📋 Prerequisites

- **Python 3.10+**
- **Redis 7+** (for Django Channels WebSocket support)
- **pip** and **virtualenv**
- **Git** (for cloning repository)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

**Fastest way to get started with all services configured**

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Start with Docker Compose**
```bash
# Build and start all services (Redis + Django)
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

3. **Access the application**
- API: http://localhost:4000/api/
- WebSocket: ws://localhost:4000/ws/playlist/
- Admin: http://localhost:4000/admin/

**Docker Services**:
- **Redis**: Port 6379 (channel layer for WebSockets)
- **Backend**: Port 4000 (Django + Daphne ASGI server)
- **Auto-setup**: Migrations, seeding handled automatically

**Stop services**:
```bash
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

### Option 2: Manual Setup

**For development or if you prefer not to use Docker**

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create and activate virtual environment**
```bash
python3 -m venv .venv

# On Linux/Mac
source .venv/bin/activate

# On Windows
.venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
REDIS_HOST=localhost
REDIS_PORT=6379
```

5. **Install and start Redis**

**macOS (Homebrew)**:
```bash
brew install redis
brew services start redis
# Verify: redis-cli ping (should return PONG)
```

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
# Verify: redis-cli ping
```

**Windows**:
- Download from https://redis.io/download
- Or use WSL and follow Ubuntu instructions

6. **Run database migrations**
```bash
python manage.py migrate
```

7. **Seed the database**
```bash
# Seed track library (35 diverse tracks)
python manage.py seed_tracks

# Seed initial playlist (10 random tracks)
python manage.py seed_playlist
```

8. **Create superuser (optional)**
```bash
python manage.py createsuperuser
```

9. **Start the server**
```bash
# Use Daphne for WebSocket support (REQUIRED)
bash start-daphne.sh

# Or run Daphne directly
daphne -b 0.0.0.0 -p 4000 config.asgi:application

# DO NOT use: python manage.py runserver
# (runserver doesn't support WebSockets)
```

10. **Verify server is running**
- API: http://localhost:4000/api/
- WebSocket: ws://localhost:4000/ws/playlist/
- Admin: http://localhost:4000/admin/ (if superuser created)

## 📚 API Documentation

### Track Library Endpoints

#### GET /api/tracks/
List all available tracks in the library.

**Query Parameters:**
- `search` - Search by title, artist, or album
- `genre` - Filter by genre
- `ordering` - Sort by fields (e.g., `title`, `-duration_seconds`)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "album": "A Night at the Opera",
    "duration_seconds": 355,
    "duration_formatted": "5:55",
    "genre": "rock",
    "cover_url": null,
    "created_at": "2025-12-04T10:00:00Z"
  }
]
```

### Playlist Endpoints

#### GET /api/playlist/
Get current playlist ordered by position.

**Response:**
```json
[
  {
    "id": 1,
    "track": {
      "id": 5,
      "title": "Bohemian Rhapsody",
      "artist": "Queen",
      "duration_seconds": 355
    },
    "position": 1.0,
    "votes": 5,
    "added_by": "Alice",
    "is_playing": true,
    "added_at": "2025-12-04T10:00:00Z",
    "played_at": "2025-12-04T10:05:00Z"
  }
]
```

#### POST /api/playlist/
Add a track to the playlist.

**Request:**
```json
{
  "track_id": 5,
  "added_by": "Alice"
}
```

**Response:** `201 Created` with playlist item data

#### PATCH /api/playlist/{id}/
Update track position or playing state.

**Request:**
```json
{
  "position": 2.5,
  "is_playing": true
}
```

#### DELETE /api/playlist/{id}/
Remove track from playlist.

**Response:** `204 No Content`

#### POST /api/playlist/{id}/vote/
Vote on a track.

**Request:**
```json
{
  "direction": "up"  // or "down"
}
```

**Response:**
```json
{
  "id": 1,
  "votes": 6,
  ...
}
```

#### GET /api/playlist/history/
Get recently played tracks (last 20).

## 🔌 WebSocket Events

### Connection

Connect to: `ws://localhost:8000/ws/playlist/`

### Event Types

**Client → Server:**
```json
{
  "type": "ping",
  "ts": "2025-12-04T12:34:56Z"
}
```

**Server → Client:**

```json
// Connection established
{
  "type": "connection.established",
  "message": "Connected to playlist updates"
}

// Track added
{
  "type": "track.added",
  "payload": { /* full playlist item */ }
}

// Track removed
{
  "type": "track.removed",
  "payload": { "id": 123 }
}

// Track moved/reordered
{
  "type": "track.moved",
  "payload": { "id": 123, "position": 2.5, ... }
}

// Track voted
{
  "type": "track.voted",
  "payload": { "id": 123, "votes": 6, ... }
}

// Track now playing
{
  "type": "track.playing",
  "payload": { "id": 123 }
}

// Heartbeat
{
  "type": "pong",
  "ts": "2025-12-04T12:34:56Z"
}
```

## 🧪 Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=apps

# Run specific test file
pytest apps/playlist/tests/test_services.py

# Run with verbose output
pytest -v
```

## 🏗️ Architecture

### Decorator Design Pattern

The backend extensively uses the **Decorator Pattern** for cross-cutting concerns:

**Decorators in `apps/realtime/decorators.py`:**
- `@broadcast_event(event_type)` - Automatically broadcast events to WebSocket clients
- `@validate_playing_state` - Ensure only one track is playing
- `@prevent_duplicate_track` - Validate against duplicate tracks
- `@log_action(name)` - Log user actions
- `@rate_limit(max_calls, period)` - Rate limiting for API calls
- `@cache_result(timeout)` - Cache function results

**Example Usage:**
```python
@transaction.atomic
@log_action('add_track')
def create(self, request):
    # Business logic here
    broadcast_playlist_event('track.added', data)
```

### Position Algorithm

The position calculation algorithm allows infinite insertions without re-indexing:

```python
def calculate_position(prev_position=None, next_position=None):
    if prev_position is None and next_position is None:
        return 1.0  # First track
    if prev_position is None:
        return next_position - 1  # Insert at beginning
    if next_position is None:
        return prev_position + 1  # Insert at end
    return (prev_position + next_position) / 2  # Insert between
```

**Examples:**
- Initial: `[1.0, 2.0, 3.0]`
- Insert between 1 and 2: `[1.0, 1.5, 2.0, 3.0]`
- Insert between 1 and 1.5: `[1.0, 1.25, 1.5, 2.0, 3.0]`

## 📁 Project Structure

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── config/                  # Django settings
│   ├── settings.py
│   ├── asgi.py             # WebSocket support
│   └── urls.py
├── apps/
│   ├── tracks/             # Track library app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── management/commands/seed_tracks.py
│   ├── playlist/           # Playlist management app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── services.py     # Position algorithm
│   │   ├── consumers.py    # WebSocket consumer
│   │   ├── routing.py
│   │   ├── signals.py
│   │   └── tests/
│   └── realtime/           # Real-time utilities
│       ├── decorators.py   # Decorator pattern implementations
│       └── utils.py
└── core/                   # Core utilities
    ├── exceptions.py
    ├── pagination.py
    └── permissions.py
```

## 🔧 Configuration

### Settings

Key settings in `config/settings.py`:

```python
# Channels (WebSocket)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# CORS (for frontend)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Auto-sort by votes (bonus feature)
AUTO_SORT_BY_VOTES = False
```

## 🐛 Troubleshooting

### Redis Connection Error

**Problem**: `redis.exceptions.ConnectionError: Error connecting to Redis`

**Solutions**:
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running, start Redis
brew services start redis          # macOS
sudo systemctl start redis         # Linux
docker-compose up redis            # Docker
```

### WebSocket Connection Failed

**Problem**: Frontend shows "Disconnected" or WebSocket errors

**Solutions**:
- **Use Daphne**: `bash start-daphne.sh` (NOT `python manage.py runserver`)
- **Verify Redis**: `redis-cli ping` should return PONG
- **Check CORS**: Ensure frontend origin in `CORS_ALLOWED_ORIGINS`
- **Check Port**: Verify backend is on port 4000, not 8000
- **Firewall**: Ensure port 4000 is not blocked

```bash
# Test WebSocket connection
wscat -c ws://localhost:4000/ws/playlist/
# Or use browser console:
# new WebSocket('ws://localhost:4000/ws/playlist/')
```

### Import Errors

**Problem**: `ModuleNotFoundError` or `ImportError`

**Solutions**:
```bash
# Ensure virtual environment is activated
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt

# Install specific missing packages
pip install drf-yasg channels-redis daphne
```

### Migration Errors

**Problem**: `django.db.utils.OperationalError` or migration conflicts

**Solutions**:
```bash
# Reset database (CAUTION: Deletes all data)
rm db.sqlite3
python manage.py migrate

# Re-seed data
python manage.py seed_tracks
python manage.py seed_playlist

# For Docker
docker-compose down -v
docker-compose up --build
```

### Port Already in Use

**Problem**: `Error: [Errno 48] Address already in use`

**Solutions**:
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or kill all Daphne processes
pkill -f daphne

# Then restart server
bash start-daphne.sh
```

### CORS Errors in Browser

**Problem**: Browser console shows CORS policy errors

**Solutions**:
- Check `.env` has correct `CORS_ALLOWED_ORIGINS`
- Ensure frontend URL matches exactly (http://localhost:3000)
- Restart Daphne server after changing `.env`
- Verify `corsheaders` is in `INSTALLED_APPS`

### Tests Failing

**Problem**: pytest fails or tests don't run

**Solutions**:
```bash
# Install test dependencies
pip install pytest pytest-django pytest-asyncio

# Run tests with verbose output
pytest -v

# Run specific test file
pytest apps/playlist/tests/test_services.py -v

# Clear pytest cache
pytest --cache-clear
```

## 📝 Development Tips

### Best Practices

1. **Always use Daphne for WebSockets**: Django's `runserver` doesn't support WebSocket connections
2. **Test WebSocket events**: Use browser DevTools Network tab (WS filter) to monitor WebSocket messages
3. **Monitor Redis**: Use `redis-cli monitor` to see real-time channel activity
4. **Check logs**: Application logs are in `logs/django.log`
5. **Use Docker for consistency**: Docker ensures Redis and Django versions are consistent

### Useful Commands

```bash
# Test WebSocket connection
wscat -c ws://localhost:4000/ws/playlist/

# Monitor Redis commands
redis-cli monitor

# Check Redis keys
redis-cli keys "*"

# View Django logs
tail -f logs/django.log

# Run specific test
pytest apps/playlist/tests/test_services.py::TestPlaylistService::test_position_algorithm -v

# Django shell (for debugging)
python manage.py shell

# Create admin user
python manage.py createsuperuser
```

### Environment Variables Reference

```env
# Django Settings
DEBUG=True                          # Enable debug mode (False in production)
SECRET_KEY=your-secret-key          # Django secret key (change in production!)
ALLOWED_HOSTS=localhost,127.0.0.1   # Comma-separated allowed hosts

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Redis Settings
REDIS_HOST=localhost                # Redis hostname (use 'redis' for Docker)
REDIS_PORT=6379                     # Redis port

# Optional Settings
AUTO_SORT_BY_VOTES=False            # Enable auto-sort by votes (bonus feature)
```

## 📚 Additional Documentation

- **[API Documentation](http://localhost:4000/api/docs/)**: Swagger/OpenAPI docs (when server running)
- **[LIMITATIONS.md](../LIMITATIONS.md)**: Known issues and limitations
- **[BONUS_FEATURES.md](../BONUS_FEATURES.md)**: Bonus features implementation
- **[Frontend README](../frontend/README.md)**: Frontend setup instructions
- **[Docker Setup](./DOCKER_SETUP.md)**: Detailed Docker configuration guide

## 🚀 Deployment Considerations

### For Production

1. **Change SECRET_KEY**: Generate a new secure key
2. **Set DEBUG=False**: Disable debug mode
3. **Use PostgreSQL**: Replace SQLite with PostgreSQL for better concurrency
4. **Use Redis Cloud**: Managed Redis service (e.g., Redis Cloud, AWS ElastiCache)
5. **Use WSS**: Secure WebSocket with SSL (wss:// instead of ws://)
6. **Add Authentication**: Implement user authentication and authorization
7. **Static Files**: Configure static file serving (e.g., WhiteNoise, S3)
8. **Environment Variables**: Use secrets manager (e.g., AWS Secrets Manager)
9. **Monitoring**: Add logging, error tracking (e.g., Sentry)
10. **Load Balancing**: Use multiple instances with shared Redis

### Docker Production

```bash
# Build production image
docker build -t playlist-backend:prod .

# Run with production settings
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

Contributions welcome! Guidelines:

1. Follow Django best practices and PEP 8
2. Write tests for new features
3. Update documentation for API changes
4. Use meaningful commit messages
5. Test WebSocket functionality in multiple browsers

## 📄 License

MIT License - Free to use for learning and development.

---

Built with Django, Channels, and Redis for real-time collaboration.
