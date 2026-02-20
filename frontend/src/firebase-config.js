import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDgwm4yCxFeN5z5PDxGEKhDjzYVwboutF8",
  authDomain: "lifedrop-alerts.firebaseapp.com",
  projectId: "lifedrop-alerts",
  storageBucket: "lifedrop-alerts.firebasestorage.app",
  messagingSenderId: "244763619386",
  appId: "1:244763619386:web:72860d5f1ee507d4010503",
  measurementId: "G-0WD4CEZVWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Function to request permission and get Token
export const requestForToken = async (user_id) => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const token = await getToken(messaging, { 
        vapidKey: "BK9aXbWgbd7YOPB-GL8cPQTZEDViuqKHEuWIE98xamEGCDAAYhoa4i8qq3XXaATEYc1lX-a_7bMbKOi8k1Y88KQ" 
      });

      if (token) {
        console.log("FCM Token Generated:", token);
        // Backend-ku token-ah save panna anupuroam
        await fetch(`https://lifedrop-ai.onrender.com/api/save-fcm-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ unique_id: user_id, fcm_token: token })
        });
      }
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Foreground message handler (App open-la irukkum pothu alert vara)
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });