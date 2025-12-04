# 🎵 Collaborative Playlist Manager

A real-time collaborative playlist application where multiple users can simultaneously manage a shared music playlist with instant synchronization across all connected clients.

## 🎥 Video Demo

📹 **[Watch Project Demo Video](https://drive.google.com/file/d/1GbuSEC4aVNlXfPgzegKIKfvdvBCaLmsm/view?usp=sharing)**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Node](https://img.shields.io/badge/node-16+-green.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![Django](https://img.shields.io/badge/django-5.0-green.svg)

## ✨ Features

- **Real-time Synchronization**: WebSocket-based instant updates across all connected browsers
- **Drag & Drop**: Smooth track reordering with intelligent position algorithm
- **Voting System**: Upvote/downvote tracks to influence playlist order
- **Track Library**: Browse, search, and filter 35+ pre-seeded tracks
- **Export Playlist**: Download as JSON, CSV, or copy to clipboard
- **Keyboard Shortcuts**: Quick navigation and playback controls
- **Auto-Sort**: Optional automatic sorting by vote count
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** and npm
- **Python 3.10+** and pip
- **Redis 7+**
- **Docker & Docker Compose** (optional, recommended)

### Using Docker (Recommended)

```bash
# 1. Start backend services
cd backend
docker-compose up -d --build

# 2. Start frontend (in new terminal)
cd ../frontend
npm install
npm start

# 3. Open http://localhost:3000
```

### Manual Setup

See detailed instructions in:
- **[Complete Setup Guide](./SETUP_GUIDE.md)** - Quick start guide for both methods
- **[Backend README](./backend/README.md)** - Backend setup and API documentation
- **[Frontend README](./frontend/README.md)** - Frontend setup and usage guide

## 📂 Project Structure

```
tenchnometrices_task/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Global state management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── api/          # API layer
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── README.md         # Frontend documentation
│
├── backend/              # Django backend application
│   ├── apps/
│   │   ├── tracks/       # Track library app
│   │   ├── playlist/     # Playlist management
│   │   └── realtime/     # WebSocket utilities
│   ├── config/           # Django settings
│   ├── requirements.txt
│   ├── docker-compose.yml
│   └── README.md         # Backend documentation
│
├── SETUP_GUIDE.md        # Complete setup instructions
├── LIMITATIONS.md        # Known issues and limitations
├── BONUS_FEATURES.md     # Bonus features status
└── README.md            # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library with Hooks and Context API
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **@dnd-kit** - Modern drag-and-drop toolkit
- **Axios** - HTTP client for REST API
- **WebSocket API** - Real-time synchronization

### Backend
- **Django 5.0** - Web framework
- **Django REST Framework** - REST API toolkit
- **Django Channels** - WebSocket support (ASGI)
- **Redis** - Channel layer backend
- **Daphne** - ASGI server
- **SQLite** - Database (upgradable to PostgreSQL)

## 📖 Documentation

- **[Complete Setup Guide](./SETUP_GUIDE.md)** - Quick start and troubleshooting
- **[Frontend README](./frontend/README.md)** - Frontend setup, features, and usage
- **[Backend README](./backend/README.md)** - Backend API, WebSocket events, and deployment
- **[Limitations](./LIMITATIONS.md)** - Known issues and browser compatibility
- **[Bonus Features](./BONUS_FEATURES.md)** - Additional features implementation status
- **[Assignment](./playlist-assignment.md)** - Original project requirements

## 🎯 Key Features Implemented

### Core Requirements ✅
- [x] Track library with search and filtering
- [x] Add tracks to playlist
- [x] Real-time synchronization via WebSockets
- [x] Voting system (upvote/downvote)
- [x] Drag and drop reordering
- [x] Position algorithm (O(1) insertions)
- [x] Now playing indicator
- [x] Duplicate prevention

### Bonus Features ✅
- [x] Export playlist (JSON, CSV, clipboard)
- [x] Keyboard shortcuts (Space, arrows, ?)
- [x] Auto-sort by votes toggle
- [x] Help modal for keyboard shortcuts
- [x] Mobile responsive design
- [x] Multi-browser real-time sync

## 🧪 Testing Real-time Sync

1. Open the application in two browser windows side-by-side
2. Add a track in one window → Appears instantly in the other
3. Drag to reorder → Position updates everywhere
4. Vote on a track → Vote count syncs immediately
5. Play a track → Equalizer animation shows in all windows

## 🚀 Deployment

### Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/
- **WebSocket**: ws://localhost:4000/ws/playlist/

### Production Considerations
- Set `DEBUG=False` in Django
- Use PostgreSQL instead of SQLite
- Use managed Redis service
- Enable HTTPS/WSS (secure WebSocket)
- Add authentication and authorization
- Configure static file serving
- Set up monitoring and logging

See [Backend README](./backend/README.md#-deployment-considerations) for detailed production setup.

## 🐛 Troubleshooting

**Frontend won't load?**
- Ensure backend is running on port 4000
- Check Redis is running: `redis-cli ping`
- Verify `.env` files are configured

**WebSocket not connecting?**
- Backend must use Daphne (not runserver)
- Check Redis is running
- Verify CORS settings in backend

**Drag and drop not working?**
- Disable "Auto-sort by Votes" toggle
- Refresh the browser

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-common-issues--solutions) for comprehensive troubleshooting.

## 📄 License

MIT License - Free to use for learning and development.

## 🤝 Contributing

Contributions are welcome! Please:
1. Follow existing code patterns
2. Write tests for new features
3. Update documentation
4. Test real-time sync in multiple browsers

---

**Built with ❤️ using React, Django, Channels, and Redis**

**For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**
