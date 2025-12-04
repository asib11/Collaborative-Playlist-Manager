/**
 * Export playlist utility functions
 * Provides JSON and CSV export formats
 */

/**
 * Export playlist as JSON file
 * @param {Array} playlist - Playlist items with track data
 */
export function exportAsJSON(playlist) {
  const exportData = {
    exported_at: new Date().toISOString(),
    total_tracks: playlist.length,
    total_duration: playlist.reduce(
      (sum, item) => sum + (item.track?.duration_seconds || 0),
      0
    ),
    tracks: playlist.map((item, index) => ({
      position: index + 1,
      title: item.track?.title || "Unknown",
      artist: item.track?.artist || "Unknown",
      album: item.track?.album || "",
      duration_seconds: item.track?.duration_seconds || 0,
      genre: item.track?.genre || "",
      votes: item.votes || 0,
      added_by: item.added_by || "Anonymous",
      added_at: item.added_at || "",
      is_playing: item.is_playing || false,
    })),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `playlist-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export playlist as CSV file
 * @param {Array} playlist - Playlist items with track data
 */
export function exportAsCSV(playlist) {
  const headers = [
    "Position",
    "Title",
    "Artist",
    "Album",
    "Duration (seconds)",
    "Genre",
    "Votes",
    "Added By",
    "Added At",
    "Is Playing",
  ];

  const rows = playlist.map((item, index) => [
    index + 1,
    `"${(item.track?.title || "Unknown").replace(/"/g, '""')}"`,
    `"${(item.track?.artist || "Unknown").replace(/"/g, '""')}"`,
    `"${(item.track?.album || "").replace(/"/g, '""')}"`,
    item.track?.duration_seconds || 0,
    `"${(item.track?.genre || "").replace(/"/g, '""')}"`,
    item.votes || 0,
    `"${(item.added_by || "Anonymous").replace(/"/g, '""')}"`,
    `"${item.added_at || ""}"`,
    item.is_playing ? "Yes" : "No",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `playlist-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format playlist for sharing (text format)
 * @param {Array} playlist - Playlist items with track data
 * @returns {string} - Formatted text
 */
export function formatPlaylistText(playlist) {
  const totalDuration = playlist.reduce(
    (sum, item) => sum + (item.track?.duration_seconds || 0),
    0
  );
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  let text = `🎵 Collaborative Playlist\n`;
  text += `📅 Exported: ${new Date().toLocaleString()}\n`;
  text += `📊 ${playlist.length} tracks • ${hours}h ${minutes}m\n\n`;

  playlist.forEach((item, index) => {
    const mins = Math.floor((item.track?.duration_seconds || 0) / 60);
    const secs = (item.track?.duration_seconds || 0) % 60;
    const votes = item.votes || 0;
    const votesStr = votes > 0 ? `+${votes}` : votes;

    text += `${index + 1}. ${item.track?.title || "Unknown"} - ${
      item.track?.artist || "Unknown"
    } (${mins}:${secs.toString().padStart(2, "0")})`;
    text += ` [${votesStr} votes]`;
    if (item.is_playing) text += ` 🔊`;
    text += `\n`;
  });

  return text;
}

/**
 * Copy playlist to clipboard
 * @param {Array} playlist - Playlist items with track data
 */
export async function copyToClipboard(playlist) {
  const text = formatPlaylistText(playlist);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
