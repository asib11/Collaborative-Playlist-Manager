import React, { useState } from "react";
import usePlaylist from "../../hooks/usePlaylist";
import useDragDrop from "../../hooks/useDragDrop";
import { calculateDragPosition } from "../../utils/position";
import PlaylistItem from "./PlaylistItem";
import Loader from "../common/Loader";
import Error from "../common/Error";
import { getTotalDuration } from "../../utils/formatSeconds";
import {
  exportAsJSON,
  exportAsCSV,
  copyToClipboard,
} from "../../utils/exportPlaylist";

/**
 * Playlist list component with drag-and-drop reordering
 */
const PlaylistList = () => {
  const {
    playlist,
    loading,
    error,
    removeTrack,
    updatePosition,
    vote,
    playTrack,
    fetchPlaylist,
  } = usePlaylist();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [autoSort, setAutoSort] = useState(false);

  /**
   * Handle export actions
   */
  const handleExport = (format) => {
    if (format === "json") {
      exportAsJSON(playlist);
      setExportMessage("Playlist exported as JSON");
    } else if (format === "csv") {
      exportAsCSV(playlist);
      setExportMessage("Playlist exported as CSV");
    } else if (format === "copy") {
      copyToClipboard(playlist).then((success) => {
        setExportMessage(
          success ? "Playlist copied to clipboard" : "Failed to copy"
        );
      });
    }
    setShowExportMenu(false);
    setTimeout(() => setExportMessage(""), 3000);
  };

  /**
   * Handle drag and drop reorder
   */
  const handleReorder = async (oldIndex, newIndex, itemId) => {
    if (oldIndex === newIndex) return;

    try {
      // Calculate new position
      const newPosition = calculateDragPosition(playlist, oldIndex, newIndex);

      // Update on server
      await updatePosition(itemId, newPosition);
    } catch (err) {
      console.error("Failed to reorder:", err);
    }
  };

  const {
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    DndContext,
    SortableContext,
    verticalListSortingStrategy,
    closestCenter,
  } = useDragDrop(playlist, handleReorder);

  /**
   * Get sorted playlist based on auto-sort setting
   */
  const displayPlaylist = React.useMemo(() => {
    if (!autoSort) return playlist;

    // Sort by votes (descending), then by position
    return [...playlist].sort((a, b) => {
      const voteDiff = (b.votes || 0) - (a.votes || 0);
      if (voteDiff !== 0) return voteDiff;
      return a.position - b.position;
    });
  }, [playlist, autoSort]);

  /**
   * Handle remove track
   */
  const handleRemove = async (playlistItemId) => {
    try {
      await removeTrack(playlistItemId);
    } catch (err) {
      console.error("Failed to remove track:", err);
    }
  };

  /**
   * Handle vote
   */
  const handleVote = async (playlistItemId, voteType) => {
    try {
      await vote(playlistItemId, voteType);
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  /**
   * Handle play track
   */
  const handlePlay = async (item) => {
    try {
      await playTrack(item.id);
    } catch (err) {
      console.error("Failed to play track:", err);
    }
  };

  if (loading && playlist.length === 0) {
    return <Loader message="Loading playlist..." />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchPlaylist} />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">🎵 Playlist</h2>
        <div className="flex items-center gap-2">
          {exportMessage && (
            <span className="text-sm text-green-600 animate-fade-in">
              {exportMessage}
            </span>
          )}
          {playlist.length > 0 && (
            <>
              <button
                onClick={() => setAutoSort(!autoSort)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  autoSort
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={
                  autoSort ? "Disable auto-sort" : "Enable auto-sort by votes"
                }
              >
                {autoSort ? "🔽 Auto-Sort ON" : "🔼 Auto-Sort OFF"}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Export playlist"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => handleExport("json")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📄 Export as JSON
                    </button>
                    <button
                      onClick={() => handleExport("csv")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📊 Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport("copy")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📋 Copy to Clipboard
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-600">
        <span>{playlist.length} tracks</span>
        {playlist.length > 0 && (
          <>
            <span className="mx-2">•</span>
            <span>{getTotalDuration(playlist)}</span>
          </>
        )}
      </div>

      {/* Playlist Items */}
      {playlist.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Playlist is empty
          </h3>
          <p className="text-sm">
            Add some tracks from the library to get started
          </p>
        </div>
      ) : autoSort ? (
        /* Auto-sorted view - no drag and drop */
        <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto scrollbar-thin pr-2">
          {displayPlaylist.map((item, index) => (
            <div
              key={item.id}
              className="transition-all duration-300"
              style={{ transitionProperty: "transform, opacity" }}
            >
              <PlaylistItem
                item={item}
                index={index}
                onRemove={handleRemove}
                onVote={handleVote}
                onPlay={handlePlay}
                isDraggable={false}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Manual sorting with drag and drop */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={playlist.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto scrollbar-thin pr-2">
              {playlist.map((item, index) => (
                <PlaylistItem
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={handleRemove}
                  onVote={handleVote}
                  onPlay={handlePlay}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default PlaylistList;
