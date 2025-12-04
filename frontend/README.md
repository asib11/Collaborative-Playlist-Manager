# 🎵 Collaborative Playlist Manager - Frontend

A modern, real-time collaborative playlist application built with React. Multiple users can simultaneously manage a shared playlist with instant synchronization via WebSockets.

## ✨ Features

### Core Features
- **Track Library**: Browse 35+ pre-seeded tracks with search and genre filtering
- **Collaborative Playlist**: Real-time synchronized playlist across all connected clients
- **Drag & Drop**: Smooth drag-and-drop reordering with position algorithm
- **Voting System**: Upvote/downvote tracks to influence playlist order
- **Now Playing**: Visual equalizer animation for currently playing track
- **WebSocket Sync**: Instant synchronization with automatic reconnection

### Bonus Features (Implemented)
- **Export Playlist**: Download as JSON, CSV, or copy to clipboard
- **Keyboard Shortcuts**: Space (play/pause), arrows (navigate), ? (help)
- **Auto-Sort by Votes**: Toggle automatic sorting by vote count
- **Duplicate Prevention**: Cannot add the same track twice
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile
- **Help Modal**: Quick reference for keyboard shortcuts

## 🛠️ Tech Stack

- **React 18.2** - UI library with Hooks and Context API
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Axios 1.6** - Promise-based HTTP client
- **@dnd-kit** - Modern drag-and-drop toolkit
- **WebSocket API** - Native browser WebSocket for real-time sync
- **Context API** - Global state management

## 📁 Project Structure

```
src/
├── api/                      # API layer
│   ├── axiosInstance.js      # Configured Axios instance
│   ├── trackApi.js           # Track library API calls
│   ├── playlistApi.js        # Playlist API calls
│   └── index.js              # API exports
│
├── components/               # React components
│   ├── TrackLibrary/
│   │   ├── TrackCard.js      # Individual track display
│   │   └── TrackList.js      # Track library with search/filter
│   │
│   ├── Playlist/
│   │   ├── PlaylistItem.js   # Draggable playlist item
│   │   ├── PlaylistList.js   # Playlist with drag-drop
│   │   ├── NowPlayingBar.js  # Currently playing track
│   │   └── VoteButtons.js    # Upvote/downvote buttons
│   │
│   └── common/
│       ├── Loader.js         # Loading spinner
│       ├── Error.js          # Error message
│       └── ConnectionStatus.js # WebSocket status indicator
│
├── hooks/                    # Custom React hooks
│   ├── usePlaylist.js        # Playlist state hook
│   ├── useWebSocket.js       # WebSocket connection hook
│   └── useDragDrop.js        # Drag and drop hook
│
├── context/                  # Context API
│   └── PlaylistContext.js    # Playlist state management
│
├── utils/                    # Utility functions
│   ├── position.js           # Position calculation algorithm
│   ├── websocketEvents.js    # WebSocket event types
│   └── formatSeconds.js      # Time formatting utilities
│
├── pages/                    # Page components
│   └── Home.js               # Main application page
│
├── styles/                   # Styles
│   └── global.css            # Global Tailwind styles
│
├── App.js                    # Main App component
└── index.js                  # Application entry point
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Backend server** running on `http://localhost:4000` (see backend README)
- **Redis** running (required for WebSocket functionality)

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` to match your backend configuration:
```env
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_WS_URL=ws://localhost:4000/ws/playlist/
```

4. **Start development server**
```bash
# Recommended: Use the start script
./start.sh

# Alternative: Use npm
npm start

# Alternative: Use node directly
node node_modules/react-scripts/bin/react-scripts.js start
```

The application will open at **http://localhost:3000**

> **Note**: If you encounter "Missing script: 'start'" error, use `./start.sh` or the node command.

### Build for Production

```bash
# Create optimized production build
npm run build

# The build folder will contain production-ready files
# Serve with any static file server
npx serve -s build
```

## 📖 Usage Guide

### Adding Tracks to Playlist

1. Browse the **Track Library** on the left
2. Use search box to filter by title, artist, or album
3. Filter by genre using dropdown
4. Click **"Add to Playlist"** button on any track
5. Track appears instantly in all connected browsers

### Managing Playlist

- **Reorder**: Drag and drop tracks to reorder
- **Vote**: Click ▲ to upvote, ▼ to downvote
- **Play**: Click track to start playing (shows equalizer animation)
- **Remove**: Click ✕ to remove track from playlist
- **Auto-sort**: Toggle "Auto-sort by Votes" to sort automatically

### Exporting Playlist

1. Click **"Export"** button in playlist header
2. Choose format:
   - **JSON**: Download structured JSON file
   - **CSV**: Download spreadsheet-compatible file
   - **Copy**: Copy formatted text to clipboard

### Keyboard Shortcuts

- **Space**: Toggle play/pause
- **→ (Right Arrow)**: Next track
- **← (Left Arrow)**: Previous track
- **? (Question mark)**: Show keyboard shortcuts help

### Testing Real-time Sync

1. Open app in two browser windows/tabs side-by-side
2. Add a track in one window → Appears in other instantly
3. Drag to reorder → Position updates everywhere
4. Vote on track → Vote count syncs immediately
5. Play track → Equalizer animation shows in all windows

## 📖 Key Components

### PlaylistContext

Manages all playlist state and operations:
- Fetches playlist from API
- Handles real-time WebSocket events
- Provides playlist operations (add, remove, vote, play)

### useWebSocket Hook

Handles WebSocket connection:
- Automatic reconnection with exponential backoff
- Event dispatching to playlist context
- Connection status tracking

### useDragDrop Hook

Provides drag-and-drop functionality:
- Configures @dnd-kit sensors
- Handles drag events
- Calculates new positions using the position algorithm

### Position Algorithm

Implements the required position calculation:

```javascript
function calculatePosition(prevPosition, nextPosition) {
  if (!prevPosition && !nextPosition) return 1.0;
  if (!prevPosition) return nextPosition - 1;
  if (!nextPosition) return prevPosition + 1;
  return (prevPosition + nextPosition) / 2;
}
```

This allows infinite insertions without re-indexing the entire playlist.

## 🎨 Styling

The application uses Tailwind CSS with custom configuration:

- **Primary Colors**: Blue theme for main actions
- **Playing Colors**: Amber/yellow for currently playing track
- **Custom Animations**: Equalizer animation for playing tracks
- **Responsive Grid**: 3-column layout on large screens

### Custom CSS Classes

- `.card` - Standard card component
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input-field` - Form input
- `.equalizer-bar` - Animated equalizer bars

## 🔄 Real-time Synchronization

The app listens for these WebSocket events:

- `track.added` - New track added to playlist
- `track.removed` - Track removed from playlist
- `track.moved` - Track position changed
- `track.voted` - Vote count updated
- `track.playing` - Playing status changed
- `playlist.updated` - Full playlist refresh needed

## 🧪 Testing Real-time Features

1. Open the app in two browser windows side-by-side
2. Add a track in one window → See it appear in the other
3. Drag to reorder in one window → See position update in the other
4. Vote on a track → See vote count sync
5. Play a track → See equalizer animation in both windows

## 🐛 Troubleshooting

### Backend Connection Issues

**Problem**: "Network Error" or "Failed to fetch"

**Solutions**:
- Ensure backend is running on `http://localhost:4000`
- Check `.env` file has correct `REACT_APP_API_BASE_URL`
- Verify backend allows CORS from `http://localhost:3000`
- Check backend terminal for errors

### WebSocket Won't Connect

**Problem**: Connection status shows "Disconnected" or constantly reconnecting

**Solutions**:
- Ensure backend is running with **Daphne** (not Django's runserver)
- Verify Redis is running: `redis-cli ping` (should return PONG)
- Check `REACT_APP_WS_URL` in `.env` matches backend WebSocket URL
- Firefox may show cosmetic reconnection messages - functionality works fine

**Start Backend with WebSocket Support**:
```bash
cd backend
bash start-daphne.sh  # Uses Daphne ASGI server on port 4000
```

### Drag and Drop Not Working

**Problem**: Cannot drag tracks to reorder

**Solutions**:
- Ensure all `@dnd-kit` packages are installed
- Disable "Auto-sort by Votes" (drag is disabled during auto-sort)
- Check browser console for JavaScript errors
- Try refreshing the page

### Tracks Not Appearing

**Problem**: Empty track library or playlist

**Solutions**:
- Verify backend is seeded with tracks:
  ```bash
  cd backend
  python manage.py seed_tracks     # Seeds 35 tracks
  python manage.py seed_playlist   # Seeds 10 playlist items
  ```
- Check browser console Network tab for API errors
- Ensure backend migrations are applied: `python manage.py migrate`

### Styles Not Loading

**Problem**: Unstyled or broken layout

**Solutions**:
- Ensure Tailwind CSS is configured (`tailwind.config.js` exists)
- Check `src/styles/global.css` is imported in `src/index.js`
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Verify `postcss` and `autoprefixer` are installed

### npm start Error

**Problem**: "Missing script: start" or "react-scripts not found"

**Solutions**:
- Use `./start.sh` script instead
- Or run: `node node_modules/react-scripts/bin/react-scripts.js start`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Export Not Working

**Problem**: Export buttons don't work or clipboard copy fails

**Solutions**:
- **Clipboard**: Requires HTTPS or localhost (browser security)
- **Download**: Check browser's download settings/permissions
- Ensure playlist has tracks to export
- Check browser console for errors

## 📦 Dependencies

### Core
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-scripts`: 5.0.1

### Utilities
- `axios`: ^1.6.0 - HTTP client
- `@dnd-kit/core`: ^6.1.0 - Drag and drop core
- `@dnd-kit/sortable`: ^8.0.0 - Sortable lists
- `@dnd-kit/utilities`: ^3.2.2 - Drag and drop utilities

### Styling
- `tailwindcss`: ^3.4.0
- `postcss`: ^8.4.32
- `autoprefixer`: ^10.4.16

## 🚀 Performance

- **Optimistic UI Updates**: Instant visual feedback before server confirmation
- **Memoized Components**: React.memo prevents unnecessary re-renders
- **Debounced Search**: Reduces API calls during typing
- **Efficient Position Algorithm**: O(1) insertions without re-indexing
- **WebSocket Heartbeat**: 20-second ping interval with auto-reconnection
- **Tested Load**: Handles 200+ tracks smoothly

## 🔐 Security Considerations

- **CORS**: Backend validates allowed origins
- **Input Sanitization**: All user inputs are validated
- **WebSocket Security**: Can be upgraded to WSS (wss://) for production
- **Environment Variables**: Sensitive config in `.env` (not committed to git)
- **No Authentication**: ⚠️ Currently no user authentication (add for production)

## 📚 Additional Documentation

- **[LIMITATIONS.md](../LIMITATIONS.md)**: Known issues and limitations
- **[BONUS_FEATURES.md](../BONUS_FEATURES.md)**: Bonus features implementation status
- **[Backend README](../backend/README.md)**: Backend setup and API documentation
- **[playlist-assignment.md](../playlist-assignment.md)**: Original project requirements

## 🤝 Contributing

Contributions are welcome! Guidelines:

1. Follow existing code structure and patterns
2. Use functional components with React Hooks
3. Follow Tailwind CSS utility-first approach
4. Add PropTypes for component props
5. Write meaningful commit messages
6. Test real-time sync in multiple browsers

## 📄 License

MIT License - Free to use for learning and development.

---

**Built with ❤️ using React, Tailwind CSS, and WebSockets**
