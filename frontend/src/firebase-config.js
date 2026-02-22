export const requestForToken = async (user_id) => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      // Alert 1: Permission check
      // alert("Permission Granted! Fetching Token..."); 

      const token = await getToken(messaging, { 
        vapidKey: "BK9aXbWgbd7YOPB-GL8cPQTZEDViuqKHEuWIE98xamEGCDAAYhoa4i8qq3XXaATEYc1lX-a_7bMbKOi8k1Y88KQ" 
      });

      if (token) {
        // alert("Token Generated! Sending to Backend...");
        
        const res = await fetch(`${API_URL}/api/save-fcm-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ unique_id: user_id, fcm_token: token })
        });
        
        const data = await res.json();
        if(data.success) {
            console.log("Token saved in DB");
        }
      } else {
        alert("Failed to generate token. Check VAPID key.");
      }
    } else {
      alert("Please ALLOW notifications to receive emergency alerts!");
    }
  } catch (error) {
    console.error("FCM Error:", error);
    // alert("FCM Error: " + error.message);
  }
};