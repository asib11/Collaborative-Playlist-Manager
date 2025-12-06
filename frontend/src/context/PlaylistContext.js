import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { playlistApi } from "../api";
import { WS_EVENTS } from "../utils/websocketEvents";

const PlaylistContext = createContext(null);

export const usePlaylistContext = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylistContext must be used within PlaylistProvider");
  }
  return context;
};

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  /**
   * Fetch playlist from API
   */
  const fetchPlaylist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await playlistApi.getAll();
      // Sort by position
      const sorted = data.sort((a, b) => a.position - b.position);
      setPlaylist(sorted);

      // Find currently playing track
      const playing = sorted.find((item) => item.is_playing);
      setCurrentlyPlaying(playing || null);
    } catch (err) {
      setError(err.message || "Failed to fetch playlist");
      console.error("Error fetching playlist:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add track to playlist
   */
  const addTrack = useCallback(
    async (trackId, position = null) => {
      try {
        // Calculate position if not provided
        let newPosition = position;
        if (newPosition === null) {
          // Add to end
          newPosition =
            playlist.length > 0
              ? playlist[playlist.length - 1].position + 1
              : 1.0;
        }

        const newItem = await playlistApi.add({
          track: trackId,
          position: newPosition,
        });

        // Don't update state here - let WebSocket event handle it
        // to avoid duplicates
        return newItem;
      } catch (err) {
        setError(err.message || "Failed to add track");
        throw err;
      }
    },
    [playlist]
  );

  /**
   * Remove track from playlist
   */
  const removeTrack = useCallback(
    async (playlistItemId) => {
      try {
        await playlistApi.remove(playlistItemId);

        // Optimistically update UI
        setPlaylist((prev) =>
          prev.filter((item) => item.id !== playlistItemId)
        );

        // Update currently playing if removed
        if (currentlyPlaying?.id === playlistItemId) {
          setCurrentlyPlaying(null);
        }
      } catch (err) {
        setError(err.message || "Failed to remove track");
        throw err;
      }
    },
    [currentlyPlaying]
  );

  /**
   * Update track position
   */
  const updatePosition = useCallback(
    async (playlistItemId, newPosition) => {
      try {
        const updated = await playlistApi.update(playlistItemId, {
          position: newPosition,
        });

        // Update in state
        setPlaylist((prev) => {
          const newPlaylist = prev.map((item) =>
            item.id === playlistItemId ? updated : item
          );
          return newPlaylist.sort((a, b) => a.position - b.position);
        });

        return updated;
      } catch (err) {
        setError(err.message || "Failed to update position");
        // Revert by refetching
        await fetchPlaylist();
        throw err;
      }
    },
    [fetchPlaylist]
  );

  /**
   * Vote on a track
   */
  const vote = useCallback(async (playlistItemId, voteType) => {
    try {
      const updated = await playlistApi.vote(playlistItemId, voteType);

      // Update in state
      setPlaylist((prev) =>
        prev.map((item) => (item.id === playlistItemId ? updated : item))
      );

      return updated;
    } catch (err) {
      setError(err.message || "Failed to vote");
      throw err;
    }
  }, []);

  /**
   * Play a track
   */
  const playTrack = useCallback(async (playlistItemId) => {
    try {
      const updated = await playlistApi.play(playlistItemId);

      // Update state - set all to not playing except this one
      setPlaylist((prev) =>
        prev.map((item) => ({
          ...item,
          is_playing: item.id === playlistItemId,
        }))
      );

      setCurrentlyPlaying(updated);
      return updated;
    } catch (err) {
      setError(err.message || "Failed to play track");
      throw err;
    }
  }, []);

  /**
   * Stop playing current track
   */
  const stopTrack = useCallback(async () => {
    if (!currentlyPlaying) return;

    try {
      await playlistApi.stop();

      // Update state
      setPlaylist((prev) =>
        prev.map((item) => ({
          ...item,
          is_playing: false,
        }))
      );

      setCurrentlyPlaying(null);
    } catch (err) {
      setError(err.message || "Failed to stop track");
      throw err;
    }
  }, [currentlyPlaying]);

  /**
   * Play next track in playlist
   */
  const playNextTrack = useCallback(async () => {
    if (!playlist || playlist.length === 0) return;

    const currentIndex = currentlyPlaying
      ? playlist.findIndex((item) => item.id === currentlyPlaying.id)
      : -1;

    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];

    if (nextTrack) {
      await playTrack(nextTrack.id);
    }
  }, [playlist, currentlyPlaying, playTrack]);

  /**
   * Play previous track in playlist
   */
  const playPreviousTrack = useCallback(async () => {
    if (!playlist || playlist.length === 0) return;

    const currentIndex = currentlyPlaying
      ? playlist.findIndex((item) => item.id === currentlyPlaying.id)
      : 0;

    const prevIndex =
      currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
    const prevTrack = playlist[prevIndex];

    if (prevTrack) {
      await playTrack(prevTrack.id);
    }
  }, [playlist, currentlyPlaying, playTrack]);

  /**
   * Toggle play/pause for current track
   */
  const togglePlayPause = useCallback(async () => {
    if (currentlyPlaying) {
      await stopTrack();
    } else if (playlist && playlist.length > 0) {
      // Play first track if nothing is playing
      await playTrack(playlist[0].id);
    }
  }, [currentlyPlaying, playlist, stopTrack, playTrack]);

  /**
   * Handle WebSocket events
   */
  const handleWebSocketEvent = useCallback(
    (event) => {
      console.log("[PlaylistContext] WebSocket event:", event);

      // Backend sends {type, payload}, map payload to playlist_item for consistency
      const playlistItem = event.payload || event.playlist_item;
      const itemId = event.payload?.id || event.playlist_item_id || event.id;

      switch (event.type) {
        case WS_EVENTS.TRACK_ADDED:
          if (playlistItem) {
            setPlaylist((prev) => {
              // Check if already exists
              if (prev.some((item) => item.id === playlistItem.id)) {
                return prev;
              }
              return [...prev, playlistItem].sort(
                (a, b) => a.position - b.position
              );
            });
          }
          break;

        case WS_EVENTS.TRACK_REMOVED:
          if (itemId) {
            setPlaylist((prev) => prev.filter((item) => item.id !== itemId));
            if (currentlyPlaying?.id === itemId) {
              setCurrentlyPlaying(null);
            }
          }
          break;

        case WS_EVENTS.TRACK_MOVED:
          if (playlistItem) {
            setPlaylist((prev) => {
              const updated = prev.map((item) =>
                item.id === playlistItem.id ? playlistItem : item
              );
              return updated.sort((a, b) => a.position - b.position);
            });
          }
          break;

        case WS_EVENTS.TRACK_VOTED:
          if (playlistItem) {
            setPlaylist((prev) =>
              prev.map((item) =>
                item.id === playlistItem.id ? playlistItem : item
              )
            );
          }
          break;

        case WS_EVENTS.TRACK_PLAYING:
          if (playlistItem) {
            setPlaylist((prev) =>
              prev.map((item) => ({
                ...item,
                is_playing: item.id === playlistItem.id,
              }))
            );
            setCurrentlyPlaying(playlistItem.is_playing ? playlistItem : null);
          }
          break;

        case WS_EVENTS.PLAYLIST_UPDATED:
          // Refetch entire playlist
          fetchPlaylist();
          break;

        default:
          break;
      }
    },
    [currentlyPlaying, fetchPlaylist]
  );

  // Initial fetch
  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  const value = {
    playlist,
    loading,
    error,
    currentlyPlaying,
    fetchPlaylist,
    addTrack,
    removeTrack,
    updatePosition,
    vote,
    playTrack,
    stopTrack,
    playNextTrack,
    playPreviousTrack,
    togglePlayPause,
    handleWebSocketEvent,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
