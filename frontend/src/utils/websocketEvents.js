/**
 * WebSocket event types for playlist synchronization
 */
export const WS_EVENTS = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",

  // Playlist events
  PLAYLIST_UPDATED: "playlist.updated",
  TRACK_ADDED: "track.added",
  TRACK_REMOVED: "track.removed",
  TRACK_MOVED: "track.moved",
  TRACK_VOTED: "track.voted",
  TRACK_PLAYING: "track.playing",

  // Keep-alive
  PING: "ping",
  PONG: "pong",
};

/**
 * WebSocket connection states
 */
export const WS_STATES = {
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  RECONNECTING: "RECONNECTING",
  ERROR: "ERROR",
};

/**
 * Reconnection configuration
 */
export const RECONNECT_CONFIG = {
  MAX_ATTEMPTS: 10,
  DELAYS: [1000, 2000, 5000, 10000, 30000], // Exponential backoff in ms
  PING_INTERVAL: 20000, // Send ping every 20 seconds (reduced from 30)
};
