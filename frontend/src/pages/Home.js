import React, { useState } from "react";
import usePlaylist from "../hooks/usePlaylist";
import useWebSocket from "../hooks/useWebSocket";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import TrackList from "../components/TrackLibrary/TrackList";
import PlaylistList from "../components/Playlist/PlaylistList";
import NowPlayingBar from "../components/Playlist/NowPlayingBar";
import ConnectionStatus from "../components/common/ConnectionStatus";
import KeyboardShortcutsModal from "../components/common/KeyboardShortcutsModal";

/**
 * Home page - Main application layout
 * Three-column layout: Track Library | Playlist | Now Playing
 */
const Home = () => {
  const {
    handleWebSocketEvent,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
  } = usePlaylist();
  const [showHelpModal, setShowHelpModal] = useState(false);

  // WebSocket URL from environment or default
  const WS_URL =
    process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws/playlist/";

  // Connect to WebSocket and handle events
  const { connectionState, error: wsError } = useWebSocket(
    WS_URL,
    handleWebSocketEvent
  );

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: togglePlayPause,
    onNext: playNextTrack,
    onPrevious: playPreviousTrack,
    onHelp: () => setShowHelpModal(true),
    enabled: true,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎵 Collaborative Playlist Manager
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time collaborative music playlist with live sync
              </p>
            </div>
            <ConnectionStatus
              connectionState={connectionState}
              error={wsError}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Track Library */}
          <div className="card">
            <TrackList />
          </div>

          {/* Middle Column - Playlist */}
          <div className="card">
            <PlaylistList />
          </div>

          {/* Right Column - Now Playing */}
          <div>
            <NowPlayingBar />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-600">
            Collaborative Playlist Manager • Real-time sync powered by
            WebSockets •{" "}
            <button
              onClick={() => setShowHelpModal(true)}
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Keyboard Shortcuts (?)
            </button>
          </p>
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
};

export default Home;
