import React from "react";
import { PlaylistProvider } from "./context/PlaylistContext";
import Home from "./pages/Home";
import "./styles/global.css";

/**
 * Main App Component
 * Wraps the application with necessary context providers
 */
function App() {
  return (
    <PlaylistProvider>
      <Home />
    </PlaylistProvider>
  );
}

export default App;
