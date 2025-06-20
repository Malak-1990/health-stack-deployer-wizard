import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Render the root React app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker only in production mode and if supported
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch(error => {
        // Optionally send error to your analytics service
        console.error('SW registration failed:', error);
      });
  });
}
