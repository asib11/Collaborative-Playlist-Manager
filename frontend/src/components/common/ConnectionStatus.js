import React from "react";
import { WS_STATES } from "../../utils/websocketEvents";

/**
 * WebSocket connection status indicator
 * @param {string} connectionState - Current connection state
 * @param {string} error - Error message if any
 */
const ConnectionStatus = ({ connectionState, error }) => {
  const getStatusConfig = () => {
    switch (connectionState) {
      case WS_STATES.CONNECTED:
        return {
          text: "Connected",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: "✓",
          pulse: true,
        };
      case WS_STATES.CONNECTING:
      case WS_STATES.RECONNECTING:
        return {
          text:
            connectionState === WS_STATES.RECONNECTING
              ? "Reconnecting..."
              : "Connecting...",
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          icon: "○",
          pulse: true,
        };
      case WS_STATES.ERROR:
        return {
          text: "Error",
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          icon: "✕",
          pulse: false,
        };
      case WS_STATES.DISCONNECTED:
      default:
        return {
          text: "Disconnected",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: "○",
          pulse: false,
        };
    }
  };

  const status = getStatusConfig();

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${status.bgColor} border border-gray-200`}
    >
      <div
        className={`w-2 h-2 rounded-full ${status.color} ${
          status.pulse ? "animate-pulse" : ""
        }`}
      />
      <span className={`text-sm font-medium ${status.textColor}`}>
        {status.icon} {status.text}
      </span>
      {error && connectionState === WS_STATES.ERROR && (
        <span className="text-xs text-red-600 ml-2" title={error}>
          ({error})
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;
