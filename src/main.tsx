import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Service Worker Registration - Trekker's Ghost Mode
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[GonePal] Ghost Mode activated:', registration.scope);
      })
      .catch((error) => {
        console.log('[GonePal] Ghost Mode failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
