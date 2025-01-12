// admin.js (this is your FCM notification utility file)
import admin from "firebase-admin";
import serviceAccount from "./a.json" assert { type: "json" }; // Ensure this path is correct

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send FCM notification
export async function sendNotification(
  title,
  body,
  customKey,
  topic,
  type,
  id,
  name,userId
) {
  const message = {
    topic: topic, // Topic can be passed dynamically
    data: {
      // Use `data` instead of `notification`
      title, // Title and body should be inside `data`
      body,
      customKey: JSON.stringify(customKey), // You can include any other custom data here
      type: type,
      id: JSON.stringify(id),
      name: name,
      userId: userId || "",
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
