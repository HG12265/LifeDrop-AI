importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDgwm4yCxFeN5z5PDxGEKhDjzYVwboutF8",
  projectId: "lifedrop-alerts",
  messagingSenderId: "244763619386",
  appId: "1:244763619386:web:72860d5f1ee507d4010503"
});

const messaging = firebase.messaging();

// ✅ BACKGROUND MESSAGE HANDLER (Custom Vibration & Persistence)
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  // Backend-la irunthu vara data-va edukuroam
  const notificationTitle = payload.data?.title || payload.notification?.title || "🚨 EMERGENCY BLOOD REQUEST";
  const notificationOptions = {
    body: payload.data?.body || payload.notification?.body || "A patient needs your help immediately!",
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'emergency-alert', // Double notification-ah thadukka orey tag
    renotify: true,
    requireInteraction: true, // ✅ User click/swipe pannura varaikkum notification screen-la irukkum
    
    // ✅ 5 SECONDS VIBRATION PATTERN (Vibrate 1s, Pause 0.5s, Vibrate 1s...)
    vibrate: [1000, 500, 1000, 500, 1000, 500, 1000], 
    
    data: {
      url: payload.data?.click_action || 'https://life-drop-ai.vercel.app/donor-dashboard'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ NOTIFICATION CLICK LOGIC (Smart Window Focus)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Notification data-la irunthu URL-ah edukuroam
  const urlToOpen = event.notification.data?.url || 'https://life-drop-ai.vercel.app/donor-dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // App already open-la iruntha athaiye focus pannu
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Illana puthu window open pannu
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});