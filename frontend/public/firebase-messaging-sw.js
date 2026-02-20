importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDgwm4yCxFeN5z5PDxGEKhDjzYVwboutF8",
  projectId: "lifedrop-alerts",
  messagingSenderId: "244763619386",
  appId: "1:244763619386:web:72860d5f1ee507d4010503"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  // Browser handles the notification display automatically from the 'notification' payload
});

// ✅ UPDATED NOTIFICATION CLICK LOGIC
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  // 1. Close the notification popup
  event.notification.close();

  // 2. Define the URL to open (Dashboard is the best place for donors)
  const targetUrl = 'https://lifedrop-ai.vercel.app/donor-dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 3. Check if the app is already open in any tab
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If already open, just focus that tab
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // 4. If not open, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});