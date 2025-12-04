import React from "react";

/**
 * Keyboard shortcuts help modal
 * Shows available keyboard shortcuts
 */
const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Space", description: "Play / Pause current track" },
    { key: "→", description: "Play next track" },
    { key: "←", description: "Play previous track" },
    { key: "?", description: "Show this help dialog" },
    { key: "Esc", description: "Close dialogs" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            ⌨️ Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-700">{shortcut.description}</span>
              <kbd className="px-3 py-1 bg-gray-100 text-gray-800 rounded font-mono text-sm border border-gray-300">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">?</kbd>{" "}
            anytime to show this dialog
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
