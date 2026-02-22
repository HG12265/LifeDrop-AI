importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDgwm4yCxFeN5z5PDxGEKhDjzYVwboutF8",
  projectId: "lifedrop-alerts",
  messagingSenderId: "244763619386",
  appId: "1:244763619386:web:72860d5f1ee507d4010503"
});

const messaging = firebase.messaging();

// ✅ DATA-ONLY PAYLOAD HANDLER
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  // Data payload-la irunthu details edukuroam
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'emergency-alert', 
    renotify: true,
    requireInteraction: true, // User swipe pannura varaikkum nikkum
    
    // ✅ 5 SECONDS VIBRATION PATTERN (Vibrate 1s, Pause 0.5s...)
    vibrate: [1000, 500, 1000, 500, 1000, 500, 1000], 
    
    data: {
      url: payload.data.click_action
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// CLICK LOGIC
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});