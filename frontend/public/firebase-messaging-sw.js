importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDgwm4yCxFeN5z5PDxGEKhDjzYVwboutF8",
  projectId: "lifedrop-alerts",
  messagingSenderId: "244763619386",
  appId: "1:244763619386:web:72860d5f1ee507d4010503"
});

const messaging = firebase.messaging();

// Background notification handler
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png', // Unga app logo path
    badge: '/pwa-192x192.png',
    // EMERGENCY VIBRATION PATTERN
    vibrate: [200, 100, 200, 100, 200, 100, 400], 
    tag: 'emergency-alert',
    renotify: true,
    data: {
      url: '/donor-dashboard' // Click panna dashboard-ku poga
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click panna app open aaga
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://lifedrop-ai.vercel.app/donor-dashboard')
  );
});