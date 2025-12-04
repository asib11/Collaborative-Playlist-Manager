# Backend Server - WebSocket Support

## Important: Use Daphne for WebSocket Connections

The Django development server (`manage.py runserver`) **does NOT support WebSockets**. 

For the collaborative playlist to work with real-time synchronization, you MUST use **Daphne** (ASGI server).

## Starting the Backend

### Option 1: Using the startup script (Recommended)
```bash
./start-daphne.sh
```

### Option 2: Manual command
```bash
cd backend
python3 -m daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

### Option 3: Development server (No WebSocket support)
```bash
# This works for REST API only, but WebSockets will fail
python3 manage.py runserver
```

## What's Running

When Daphne starts successfully, you'll see:
```
INFO Starting server at tcp:port=8000:interface=0.0.0.0
INFO Listening on TCP address 0.0.0.0:8000
```

The server provides:
- **REST API**: http://localhost:8000/api/
- **WebSocket**: ws://localhost:8000/ws/playlist/
- **Admin**: http://localhost:8000/admin/

## Troubleshooting

### WebSocket Connection Failed
- **Symptom**: Frontend shows "Failed to connect after multiple attempts"
- **Cause**: Using `manage.py runserver` instead of Daphne
- **Solution**: Use `./start-daphne.sh` or the Daphne command above

### ModuleNotFoundError: No module named 'config'
- **Cause**: Running Daphne from wrong directory
- **Solution**: Always run from the backend directory or use the startup script

### Port 8000 already in use
```bash
# Find the process using port 8000
lsof -ti:8000

# Kill it
pkill -f "python.*manage.py runserver"
# or
kill $(lsof -ti:8000)
```

## Dependencies

Make sure these are installed:
```bash
pip install daphne channels channels-redis
```

## Configuration

WebSocket routing is configured in:
- `config/asgi.py` - ASGI application setup
- `apps/playlist/routing.py` - WebSocket URL patterns
- `apps/playlist/consumers.py` - WebSocket consumer logic

## Redis Requirement

Django Channels requires Redis for the channel layer. Make sure Redis is running:

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis if needed (depends on your system)
sudo systemctl start redis
# or
redis-server
```

If Redis is not installed, WebSocket connections will still work but won't sync across multiple Daphne instances.

## Production

For production, consider:
1. Use a process manager (systemd, supervisor)
2. Set up nginx as a reverse proxy
3. Use multiple Daphne workers
4. Configure Redis properly
5. Set DEBUG=False in settings

Example systemd service:
```ini
[Unit]
Description=Daphne Server
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/daphne -b 0.0.0.0 -p 8000 config.asgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```
