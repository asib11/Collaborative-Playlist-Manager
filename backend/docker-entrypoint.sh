#!/bin/bash

# Entrypoint script for Docker container

set -e

echo "🔧 Running database migrations..."
python manage.py migrate --noinput

# Check if we need to seed data
echo "📊 Checking if database needs seeding..."
TRACK_COUNT=$(python manage.py shell -c "from apps.tracks.models import Track; print(Track.objects.count())")

if [ "$TRACK_COUNT" -eq "0" ]; then
    echo "🌱 Seeding track library..."
    python manage.py seed_tracks
    
    echo "🎵 Seeding playlist..."
    python manage.py seed_playlist
else
    echo "✅ Database already seeded (found $TRACK_COUNT tracks)"
fi

echo "🚀 Starting Daphne server..."
exec daphne -b 0.0.0.0 -p 4000 config.asgi:application
