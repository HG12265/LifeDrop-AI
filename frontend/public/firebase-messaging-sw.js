importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDgwm4yCxFeN5z5PDxGEKhDjzYVwboutF8",
  projectId: "lifedrop-alerts",
  messagingSenderId: "244763619386",
  appId: "1:244763619386:web:72860d5f1ee507d4010503"
});

const messaging = firebase.messaging();

// Background message handler (Empty as we use 'notification' object from backend)
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
});

// ✅ NOTIFICATION CLICK LOGIC
self.addEventListener('notificationclick', (event) => {
  // 1. Notification-ah close panniduvom
  event.notification.close();

  // 2. Enga poganum-nu mudivu pannuvom (Default: Donor Dashboard)
  const urlToOpen = new URL('/donor-dashboard', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 3. App already open-la irukka nu check pannuvom
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        // Oru velai namma site already open-la irundha, adhaiye focus pannuvom
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // 4. App open-la illana, pudhu window-la open pannuvom
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});