import React, { useState, useEffect } from "react";
import { trackApi } from "../../api";
import usePlaylist from "../../hooks/usePlaylist";
import TrackCard from "./TrackCard";
import Loader from "../common/Loader";
import Error from "../common/Error";

/**
 * Track library list component with search and filter
 */
const TrackList = () => {
  const { playlist, addTrack } = usePlaylist();
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);

  /**
   * Fetch tracks from API
   */
  const fetchTracks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await trackApi.getAll();
      setTracks(data);
      setFilteredTracks(data);

      // Extract unique genres
      const uniqueGenres = [
        ...new Set(data.map((track) => track.genre)),
      ].filter(Boolean);
      setGenres(uniqueGenres.sort());
    } catch (err) {
      setError(err.message || "Failed to fetch tracks");
      console.error("Error fetching tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter tracks based on search and genre
   */
  useEffect(() => {
    let filtered = [...tracks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (track) =>
          track.title?.toLowerCase().includes(query) ||
          track.artist?.toLowerCase().includes(query) ||
          track.album?.toLowerCase().includes(query)
      );
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter((track) => track.genre === selectedGenre);
    }

    setFilteredTracks(filtered);
  }, [searchQuery, selectedGenre, tracks]);

  /**
   * Check if track is already in playlist
   */
  const isInPlaylist = (trackId) => {
    return playlist.some(
      (item) => item.track?.id === trackId || item.track_id === trackId
    );
  };

  /**
   * Handle add track to playlist
   */
  const handleAddTrack = async (track) => {
    if (isInPlaylist(track.id)) return;

    try {
      await addTrack(track.id);
    } catch (err) {
      console.error("Failed to add track:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTracks();
  }, []);

  if (loading && tracks.length === 0) {
    return <Loader message="Loading track library..." />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchTracks} />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">📚 Track Library</h2>
        <span className="text-sm text-gray-600">
          {filteredTracks.length} tracks
        </span>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists, albums..."
            className="input-field pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Genre Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Genre:</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="input-field flex-1"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {selectedGenre && (
            <button
              onClick={() => setSelectedGenre("")}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto scrollbar-thin pr-2">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tracks found</p>
            {(searchQuery || selectedGenre) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("");
                }}
                className="mt-2 text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onAdd={handleAddTrack}
              isInPlaylist={isInPlaylist(track.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TrackList;
