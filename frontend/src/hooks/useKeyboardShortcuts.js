import { useEffect, useCallback } from "react";

/**
 * Custom hook for keyboard shortcuts
 * Handles play/pause, navigation, and other keyboard controls
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.onPlayPause - Callback for space bar (play/pause)
 * @param {Function} options.onNext - Callback for right arrow (next track)
 * @param {Function} options.onPrevious - Callback for left arrow (previous track)
 * @param {Function} options.onVolumeUp - Callback for up arrow (volume up)
 * @param {Function} options.onVolumeDown - Callback for down arrow (volume down)
 * @param {Function} options.onHelp - Callback for ? key (show help)
 * @param {boolean} options.enabled - Enable/disable shortcuts (default: true)
 */
const useKeyboardShortcuts = ({
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeUp,
  onVolumeDown,
  onHelp,
  enabled = true,
} = {}) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      // Ignore if user is typing in an input field
      const target = event.target;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Handle keyboard shortcuts
      switch (event.key) {
        case " ": // Space bar - Play/Pause
          event.preventDefault();
          if (onPlayPause) onPlayPause();
          break;

        case "ArrowRight": // Right arrow - Next track
          event.preventDefault();
          if (onNext) onNext();
          break;

        case "ArrowLeft": // Left arrow - Previous track
          event.preventDefault();
          if (onPrevious) onPrevious();
          break;

        case "ArrowUp": // Up arrow - Volume up
          event.preventDefault();
          if (onVolumeUp) onVolumeUp();
          break;

        case "ArrowDown": // Down arrow - Volume down
          event.preventDefault();
          if (onVolumeDown) onVolumeDown();
          break;

        case "?": // Question mark - Show help
          event.preventDefault();
          if (onHelp) onHelp();
          break;

        default:
          break;
      }
    },
    [enabled, onPlayPause, onNext, onPrevious, onVolumeUp, onVolumeDown, onHelp]
  );

  useEffect(() => {
    if (!enabled) return;

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  return {
    enabled,
  };
};

export default useKeyboardShortcuts;
