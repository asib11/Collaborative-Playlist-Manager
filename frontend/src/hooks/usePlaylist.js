import { usePlaylistContext } from "../context/PlaylistContext";

/**
 * Custom hook to access playlist context
 * Provides all playlist state and methods
 */
const usePlaylist = () => {
  return usePlaylistContext();
};

export default usePlaylist;
