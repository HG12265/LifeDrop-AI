import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ==================== SERVICE WORKER LOGIC ====================
// Intha logic double notification-ah thadukka pazhaya workers-ah clear pannum
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      // 1. First, unregister all existing service workers
      for (let registration of registrations) {
        registration.unregister();
        console.log("🧹 Ghost Service Worker removed!");
      }
      
      // 2. Now, register our fresh Firebase Messaging Service Worker
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('🚀 LifeDrop Service Worker registered successfully:', registration.scope);
        })
        .catch((err) => {
          console.error('❌ Service Worker registration failed:', err);
        });
    });
  });
}
// ==============================================================

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)