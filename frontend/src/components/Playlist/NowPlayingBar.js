import React from "react";
import usePlaylist from "../../hooks/usePlaylist";
import { formatSeconds } from "../../utils/formatSeconds";

/**
 * Now Playing bar component
 * Shows currently playing track with basic info
 */
const NowPlayingBar = () => {
  const { currentlyPlaying, stopTrack } = usePlaylist();

  if (!currentlyPlaying) {
    return (
      <div className="card bg-gray-50">
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⏸️</div>
          <p className="text-sm">No track playing</p>
          <p className="text-xs mt-1">Click play on any track to start</p>
        </div>
      </div>
    );
  }

  const track = currentlyPlaying.track;

  return (
    <div className="card bg-playing-100 border-playing-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">🎧 Now Playing</h2>
        <button
          onClick={stopTrack}
          className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-white transition-colors"
        >
          Stop
        </button>
      </div>

      <div className="space-y-4">
        {/* Album Art Placeholder */}
        <div className="bg-gradient-to-br from-playing-500 to-playing-700 rounded-lg aspect-square flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-2">🎵</div>
            {/* Equalizer Animation */}
            <div className="flex justify-center gap-1">
              <div className="w-2 h-8 bg-white equalizer-bar"></div>
              <div className="w-2 h-8 bg-white equalizer-bar animation-delay-150"></div>
              <div className="w-2 h-8 bg-white equalizer-bar animation-delay-300"></div>
              <div className="w-2 h-8 bg-white equalizer-bar animation-delay-450"></div>
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {track?.title || "Unknown Track"}
          </h3>
          <p className="text-lg text-gray-700 mb-3">
            {track?.artist || "Unknown Artist"}
          </p>

          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            {track?.genre && (
              <span className="px-3 py-1 bg-white rounded-full">
                {track.genre}
              </span>
            )}
            {track?.duration_seconds && (
              <span>{formatSeconds(track.duration_seconds)}</span>
            )}
            {track?.bpm && <span>{track.bpm} BPM</span>}
          </div>
        </div>

        {/* Vote Info */}
        <div className="text-center pt-4 border-t border-playing-300">
          <div
            className={`text-3xl font-bold ${
              currentlyPlaying.votes > 0
                ? "text-green-600"
                : currentlyPlaying.votes < 0
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {currentlyPlaying.votes > 0 ? "+" : ""}
            {currentlyPlaying.votes || 0}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {currentlyPlaying.votes === 1 || currentlyPlaying.votes === -1
              ? "vote"
              : "votes"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBar;
