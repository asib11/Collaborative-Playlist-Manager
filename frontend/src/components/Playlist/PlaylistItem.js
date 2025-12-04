import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { formatSeconds } from "../../utils/formatSeconds";
import VoteButtons from "./VoteButtons";

/**
 * Individual playlist item component with drag-and-drop
 * @param {Object} item - Playlist item
 * @param {number} index - Item index in playlist
 * @param {Function} onRemove - Remove callback
 * @param {Function} onVote - Vote callback (upvote/downvote)
 * @param {Function} onPlay - Play callback
 */
const PlaylistItem = ({ item, index, onRemove, onVote, onPlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const track = item.track;
  const isPlaying = item.is_playing;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-3 ${
        isPlaying
          ? "border-playing-500 bg-playing-100 shadow-md"
          : "border-gray-200 hover:shadow-md"
      } transition-all`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 11-2 0 1 1 0 012 0zm-1-7a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1z" />
          </svg>
        </div>

        {/* Track Number */}
        <div className="flex-shrink-0 w-8 text-center text-sm font-semibold text-gray-500">
          {index + 1}
        </div>

        {/* Play Button */}
        <button
          onClick={() => onPlay(item)}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isPlaying
              ? "bg-playing-500 text-white"
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
          title="Play track"
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-3 bg-white equalizer-bar"></div>
              <div className="w-1 h-3 bg-white equalizer-bar animation-delay-150"></div>
              <div className="w-1 h-3 bg-white equalizer-bar animation-delay-300"></div>
            </div>
          ) : (
            <svg
              className="w-4 h-4 ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {track?.title || "Unknown Track"}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {track?.artist || "Unknown Artist"}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            {track?.genre && (
              <span className="px-2 py-0.5 bg-gray-100 rounded">
                {track.genre}
              </span>
            )}
            {track?.duration_seconds && (
              <span>{formatSeconds(track.duration_seconds)}</span>
            )}
          </div>
        </div>

        {/* Vote Buttons */}
        <VoteButtons
          votes={item.votes || 0}
          onUpvote={() => onVote(item.id, "upvote")}
          onDownvote={() => onVote(item.id, "downvote")}
        />

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-2"
          title="Remove from playlist"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PlaylistItem;
