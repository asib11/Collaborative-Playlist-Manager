import { useState, useEffect, useCallback, useRef } from "react";
import {
  WS_EVENTS,
  WS_STATES,
  RECONNECT_CONFIG,
} from "../utils/websocketEvents";

/**
 * Custom hook for WebSocket connection
 * Handles connection, reconnection, and event dispatching
 */
const useWebSocket = (url, onMessage) => {
  const [connectionState, setConnectionState] = useState(
    WS_STATES.DISCONNECTED
  );
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const pingIntervalRef = useRef(null);

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    if (!url) {
      console.error("[WebSocket] No URL provided");
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("[WebSocket] Already connected");
      return;
    }

    try {
      console.log("[WebSocket] Connecting to:", url);
      setConnectionState(WS_STATES.CONNECTING);
      setError(null);

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WebSocket] Connected");
        setConnectionState(WS_STATES.CONNECTED);
        reconnectAttemptRef.current = 0;
        setError(null);

        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: WS_EVENTS.PING }));
          }
        }, RECONNECT_CONFIG.PING_INTERVAL);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("[WebSocket] Message received:", data);

          // Handle pong response
          if (data.type === WS_EVENTS.PONG) {
            return;
          }

          // Pass message to callback
          if (onMessage) {
            onMessage(data);
          }
        } catch (err) {
          console.error("[WebSocket] Error parsing message:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("[WebSocket] Error:", err);
        setError("WebSocket connection error");
        setConnectionState(WS_STATES.ERROR);
      };

      ws.onclose = (event) => {
        console.log("[WebSocket] Closed:", event.code, event.reason);

        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Don't reconnect if this was a normal closure (code 1000) or intentional close
        if (event.code === 1000 || !event.wasClean) {
          setConnectionState(WS_STATES.DISCONNECTED);

          // Only reconnect if not at max attempts
          if (reconnectAttemptRef.current < RECONNECT_CONFIG.MAX_ATTEMPTS) {
            const delay =
              RECONNECT_CONFIG.DELAYS[
                Math.min(
                  reconnectAttemptRef.current,
                  RECONNECT_CONFIG.DELAYS.length - 1
                )
              ];

            console.log(
              `[WebSocket] Reconnecting in ${delay}ms (attempt ${
                reconnectAttemptRef.current + 1
              })`
            );
            setConnectionState(WS_STATES.RECONNECTING);

            reconnectTimerRef.current = setTimeout(() => {
              reconnectAttemptRef.current++;
              connect();
            }, delay);
          } else {
            console.error("[WebSocket] Max reconnection attempts reached");
            setError("Failed to connect after multiple attempts");
            setConnectionState(WS_STATES.ERROR);
          }
        } else {
          setConnectionState(WS_STATES.DISCONNECTED);
        }
      };
    } catch (err) {
      console.error("[WebSocket] Connection error:", err);
      setError(err.message);
      setConnectionState(WS_STATES.ERROR);
    }
  }, [url, onMessage]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    console.log("[WebSocket] Disconnecting");

    // Clear timers
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionState(WS_STATES.DISCONNECTED);
  }, []);

  /**
   * Send message to WebSocket
   */
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("[WebSocket] Cannot send message - not connected");
    }
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    connectionState,
    isConnected: connectionState === WS_STATES.CONNECTED,
    error,
    sendMessage,
    reconnect: connect,
    disconnect,
  };
};

export default useWebSocket;
