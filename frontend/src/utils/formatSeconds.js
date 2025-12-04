/**
 * Format duration in seconds to MM:SS or HH:MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export function formatSeconds(seconds) {
  if (!seconds || isNaN(seconds)) {
    return "0:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/**
 * Format relative time (e.g., "2 minutes ago")
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return "";

  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

/**
 * Format vote count with + or - prefix
 * @param {number} votes - Vote count
 * @returns {string} - Formatted vote string
 */
export function formatVotes(votes) {
  if (votes > 0) return `+${votes}`;
  return votes.toString();
}

/**
 * Get total playlist duration
 * @param {Array} playlist - Array of playlist items
 * @returns {string} - Formatted total duration
 */
export function getTotalDuration(playlist) {
  if (!playlist || playlist.length === 0) return "0:00";

  const totalSeconds = playlist.reduce((sum, item) => {
    return sum + (item.track?.duration_seconds || 0);
  }, 0);

  return formatSeconds(totalSeconds);
}
