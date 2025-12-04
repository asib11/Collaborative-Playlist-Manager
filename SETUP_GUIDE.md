# 🚀 Complete Setup Guide - Collaborative Playlist Manager

Quick reference guide for setting up and running the entire application.

## 📋 Prerequisites

### Required Software
- **Node.js 16+** and npm
- **Python 3.10+** and pip
- **Redis 7+**
- **Git**
- **Docker & Docker Compose** (optional, recommended)

### System Requirements
- **OS**: Linux, macOS, or Windows (with WSL recommended)
- **RAM**: 2GB minimum, 4GB recommended
- **Disk**: 500MB free space

## 🎯 Quick Start (Recommended)

### Using Docker (Easiest)

**1. Start Backend Services**
```bash
cd backend
docker-compose up -d --build
```

**2. Start Frontend**
```bash
cd ../frontend
npm install
npm start
```

**3. Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/
- WebSocket: ws://localhost:4000/ws/playlist/

That's it! The Docker setup automatically:
- ✅ Starts Redis
- ✅ Runs database migrations
- ✅ Seeds track library (35 tracks)
- ✅ Seeds initial playlist (10 tracks)
- ✅ Starts Daphne ASGI server

---

## 🔧 Manual Setup (Without Docker)

### Step 1: Backend Setup

**1.1 Navigate to backend**
```bash
cd backend
```

**1.2 Create virtual environment**
```bash
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
```

**1.3 Install dependencies**
```bash
pip install -r requirements.txt
```

**1.4 Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings (defaults work for local development)
```

**1.5 Start Redis**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Verify Redis is running
redis-cli ping  # Should return PONG
```

**1.6 Run migrations and seed data**
```bash
python manage.py migrate
python manage.py seed_tracks     # Seeds 35 tracks
python manage.py seed_playlist   # Seeds 10 playlist items
```

**1.7 Start backend server**
```bash
bash start-daphne.sh
# Backend running at http://localhost:4000
```

### Step 2: Frontend Setup

**2.1 Navigate to frontend**
```bash
cd frontend  # From project root
```

**2.2 Install dependencies**
```bash
npm install
```

**2.3 Configure environment**
```bash
cp .env.example .env
# Defaults should work (backend at localhost:4000)
```

**2.4 Start frontend server**
```bash
./start.sh
# Or: npm start
# Frontend running at http://localhost:3000
```

---

## ✅ Verification Checklist

### Backend Checks
- [ ] Redis is running: `redis-cli ping` returns PONG
- [ ] Backend server started without errors
- [ ] API accessible: http://localhost:4000/api/tracks/ shows tracks
- [ ] WebSocket ready: Check terminal shows "Daphne running"

### Frontend Checks
- [ ] Frontend loads at http://localhost:3000
- [ ] Track library shows ~35 tracks
- [ ] Playlist shows ~10 tracks
- [ ] Connection status shows "Connected" (green dot)

### Real-time Sync Test
- [ ] Open app in two browser windows side-by-side
- [ ] Add track in window 1 → Appears in window 2 instantly
- [ ] Drag to reorder in window 2 → Updates in window 1
- [ ] Vote on track → Vote count syncs both windows
- [ ] Play track → Equalizer shows in both windows

---

## 🎨 Features Overview

### Core Features
✅ Browse track library (35+ tracks)
✅ Search and filter by genre
✅ Add tracks to playlist
✅ Drag and drop reordering
✅ Voting system (upvote/downvote)
✅ Real-time WebSocket sync
✅ Now playing indicator

### Bonus Features (Implemented)
✅ Export playlist (JSON, CSV, clipboard)
✅ Keyboard shortcuts (Space, arrows, ?)
✅ Auto-sort by votes toggle
✅ Duplicate prevention
✅ Mobile responsive design
✅ Help modal for shortcuts

---

## 🐛 Common Issues & Solutions

### Issue: Frontend shows "Disconnected"
**Solution**:
- Ensure backend is running with **Daphne** (not runserver)
- Check Redis is running: `redis-cli ping`
- Verify backend is on port 4000
- Check `.env` files match

### Issue: Backend won't start
**Solution**:
```bash
# Check if port is in use
lsof -i :4000

# Kill existing process
pkill -f daphne

# Restart Redis
brew services restart redis  # macOS
sudo systemctl restart redis  # Linux

# Restart backend
bash start-daphne.sh
```

### Issue: No tracks showing
**Solution**:
```bash
cd backend
source .venv/bin/activate
python manage.py migrate
python manage.py seed_tracks
python manage.py seed_playlist
```

### Issue: CORS errors in browser
**Solution**:
- Check backend `.env` has `CORS_ALLOWED_ORIGINS=http://localhost:3000`
- Restart backend after changing `.env`
- Clear browser cache

### Issue: Drag and drop not working
**Solution**:
- Disable "Auto-sort by Votes" toggle
- Ensure `@dnd-kit` packages installed: `npm install`
- Try refreshing browser

---

## 📚 Documentation Links

- **[Frontend README](./frontend/README.md)**: Detailed frontend setup and API
- **[Backend README](./backend/README.md)**: Backend API documentation
- **[LIMITATIONS.md](./LIMITATIONS.md)**: Known issues and limitations
- **[BONUS_FEATURES.md](./BONUS_FEATURES.md)**: Bonus features status
- **[Assignment](./playlist-assignment.md)**: Original requirements

---

## 🎯 Next Steps

1. **Explore the app**: Add tracks, drag to reorder, vote, play
2. **Test real-time sync**: Open multiple browser windows
3. **Try keyboard shortcuts**: Press `?` for help
4. **Export playlist**: Click Export button in playlist
5. **Review code**: Check project structure in READMEs

---

## 💡 Quick Commands Reference

### Backend Commands
```bash
cd backend

# Start server
bash start-daphne.sh

# Run tests
pytest

# Django shell
python manage.py shell

# Create admin user
python manage.py createsuperuser

# Reset database
rm db.sqlite3 && python manage.py migrate
python manage.py seed_tracks && python manage.py seed_playlist
```

### Frontend Commands
```bash
cd frontend

# Start development
npm start
# Or: ./start.sh

# Build production
npm run build

# Install dependencies
npm install
```

### Docker Commands
```bash
cd backend

# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset everything
docker-compose down -v
docker-compose up --build
```

### Redis Commands
```bash
# Test connection
redis-cli ping

# Monitor activity
redis-cli monitor

# View keys
redis-cli keys "*"

# Flush all data (CAUTION)
redis-cli FLUSHALL
```

---

## 🚀 Production Deployment Notes

### Pre-Production Checklist
- [ ] Change Django `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_HOSTS`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Use managed Redis (Redis Cloud, AWS ElastiCache)
- [ ] Enable HTTPS/WSS (secure WebSocket)
- [ ] Add authentication and authorization
- [ ] Set up monitoring (logging, error tracking)
- [ ] Configure static file serving
- [ ] Set up CI/CD pipeline

### Recommended Stack
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: AWS ECS, Google Cloud Run, DigitalOcean App Platform
- **Database**: PostgreSQL (AWS RDS, Google Cloud SQL)
- **Redis**: Redis Cloud, AWS ElastiCache
- **WebSocket**: AWS Application Load Balancer (WebSocket support)

---

## 📞 Support

For issues or questions:
1. Check this guide and READMEs
2. Review LIMITATIONS.md for known issues
3. Check browser console for errors
4. Verify all services are running

---

**Happy coding! 🎵 Enjoy your collaborative playlist manager!**
