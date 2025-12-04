import axiosInstance from "./axiosInstance";

/**
 * Track Library API
 */
const trackApi = {
  /**
   * Get all tracks from library
   * @param {Object} params - Query parameters (search, genre, ordering)
   * @returns {Promise<Array>} - Array of tracks
   */
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/api/tracks/", { params });
      return response.data.results || [];
    } catch (error) {
      console.error("Error fetching tracks:", error);
      throw error;
    }
  },

  /**
   * Get a single track by ID
   * @param {string|number} id - Track ID
   * @returns {Promise<Object>} - Track object
   */
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/tracks/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching track ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search tracks by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of matching tracks
   */
  search: async (query) => {
    try {
      const response = await axiosInstance.get("/api/tracks/", {
        params: { search: query },
      });
      return response.data.results || [];
    } catch (error) {
      console.error("Error searching tracks:", error);
      throw error;
    }
  },

  /**
   * Get tracks by genre
   * @param {string} genre - Genre to filter by
   * @returns {Promise<Array>} - Array of tracks in the genre
   */
  getByGenre: async (genre) => {
    try {
      const response = await axiosInstance.get("/api/tracks/", {
        params: { genre },
      });
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching ${genre} tracks:`, error);
      throw error;
    }
  },
};

export default trackApi;
