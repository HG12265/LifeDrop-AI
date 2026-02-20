importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDgwm4yCxFeN5z5PDxGEKhDjzYVwboutF8",
  projectId: "lifedrop-alerts",
  messagingSenderId: "244763619386",
  appId: "1:244763619386:web:72860d5f1ee507d4010503"
});

const messaging = firebase.messaging();

// ✅ Background handler-la manual-ah showNotification panna koodathu
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  // Browser automatic-ah backend-la irunthu vara 'notification' object-ah kaattidum.
  // Inga extra-va ethuvum ezhutha thevai illai.
});

// ✅ Notification click panna app open aaga intha logic mattum pothum
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Backend-la namma anupura click_action URL-ku pogum
  const urlToOpen = event.notification.data?.click_action || 'https://lifedrop-ai.vercel.app/donor-dashboard';

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