import axiosInstance from "./axiosInstance";

/**
 * Playlist API
 */
const playlistApi = {
  /**
   * Get all playlist items (sorted by position)
   * @returns {Promise<Array>} - Array of playlist items
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/playlist/");
      return response.data.results || [];
    } catch (error) {
      console.error("Error fetching playlist:", error);
      throw error;
    }
  },

  /**
   * Get a single playlist item by ID
   * @param {string|number} id - Playlist item ID
   * @returns {Promise<Object>} - Playlist item object
   */
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/playlist/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching playlist item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add a track to the playlist
   * @param {Object} data - { track: trackId, position: number }
   * @returns {Promise<Object>} - Created playlist item
   */
  add: async (data) => {
    try {
      const response = await axiosInstance.post("/api/playlist/", data);
      return response.data;
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      throw error;
    }
  },

  /**
   * Update a playlist item (position or playing status)
   * @param {string|number} id - Playlist item ID
   * @param {Object} data - { position, is_playing }
   * @returns {Promise<Object>} - Updated playlist item
   */
  update: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`/api/playlist/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating playlist item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remove a track from the playlist
   * @param {string|number} id - Playlist item ID
   * @returns {Promise<void>}
   */
  remove: async (id) => {
    try {
      await axiosInstance.delete(`/api/playlist/${id}/`);
    } catch (error) {
      console.error(`Error removing playlist item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Vote on a playlist track
   * @param {string|number} id - Playlist item ID
   * @param {string} voteType - 'upvote' or 'downvote'
   * @returns {Promise<Object>} - Updated playlist item
   */
  vote: async (id, voteType) => {
    try {
      // Convert voteType to direction ('upvote' -> 'up', 'downvote' -> 'down')
      const direction = voteType === "upvote" ? "up" : "down";
      const response = await axiosInstance.post(`/api/playlist/${id}/vote/`, {
        direction,
      });
      return response.data;
    } catch (error) {
      console.error(`Error voting on playlist item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Mark a track as playing
   * @param {string|number} id - Playlist item ID
   * @returns {Promise<Object>} - Updated playlist item
   */
  play: async (id) => {
    try {
      const response = await axiosInstance.post(`/api/playlist/${id}/play/`);
      return response.data;
    } catch (error) {
      console.error(`Error playing playlist item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Stop playing current track
   * @returns {Promise<Object>} - Response indicating playback stopped
   */
  stop: async () => {
    try {
      const response = await axiosInstance.post(`/api/playlist/stop/`);
      return response.data;
    } catch (error) {
      console.error("Error stopping playback:", error);
      throw error;
    }
  },

  /**
   * Get playlist history
   * @returns {Promise<Array>} - Array of previously played tracks
   */
  getHistory: async () => {
    try {
      const response = await axiosInstance.get("/api/playlist/history/");
      return response.data;
    } catch (error) {
      console.error("Error fetching playlist history:", error);
      throw error;
    }
  },
};

export default playlistApi;
