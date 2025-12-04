import React from "react";
import { formatSeconds } from "../../utils/formatSeconds";

/**
 * Individual track card component
 * @param {Object} track - Track object
 * @param {Function} onAdd - Callback when add button is clicked
 * @param {boolean} isInPlaylist - Whether track is already in playlist
 */
const TrackCard = ({ track, onAdd, isInPlaylist }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {track.title}
          </h3>
          <p className="text-sm text-gray-600 truncate mb-2">{track.artist}</p>

          {/* Track Details */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
              {track.genre}
            </span>
            <span>{formatSeconds(track.duration_seconds)}</span>
            {track.bpm && <span>{track.bpm} BPM</span>}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => onAdd(track)}
          disabled={isInPlaylist}
          className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isInPlaylist
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
          title={isInPlaylist ? "Already in playlist" : "Add to playlist"}
        >
          {isInPlaylist ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Added
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default TrackCard;
