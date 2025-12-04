/**
 * Calculate position for inserting a track between two others
 * This algorithm allows infinite insertions without reindexing
 *
 * @param {number|null} prevPosition - Position of the track before insertion point
 * @param {number|null} nextPosition - Position of the track after insertion point
 * @returns {number} - New position for the track
 */
export function calculatePosition(prevPosition, nextPosition) {
  // First track in empty playlist
  if (!prevPosition && !nextPosition) {
    return 1.0;
  }

  // Insert at beginning
  if (!prevPosition) {
    return nextPosition - 1;
  }

  // Insert at end
  if (!nextPosition) {
    return prevPosition + 1;
  }

  // Insert between two tracks
  return (prevPosition + nextPosition) / 2;
}

/**
 * Calculate new position when dragging and dropping a track
 *
 * @param {Array} playlist - Current playlist array (sorted by position)
 * @param {number} activeIndex - Current index of dragged item
 * @param {number} overIndex - Target drop index
 * @returns {number} - New position value
 */
export function calculateDragPosition(playlist, activeIndex, overIndex) {
  if (activeIndex === overIndex) {
    return playlist[activeIndex].position;
  }

  // Moving down (to higher index)
  if (activeIndex < overIndex) {
    const prevPosition = playlist[overIndex]?.position || null;
    const nextPosition = playlist[overIndex + 1]?.position || null;
    return calculatePosition(prevPosition, nextPosition);
  }

  // Moving up (to lower index)
  const prevPosition = playlist[overIndex - 1]?.position || null;
  const nextPosition = playlist[overIndex]?.position || null;
  return calculatePosition(prevPosition, nextPosition);
}
