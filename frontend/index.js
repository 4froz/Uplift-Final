/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Set up background message handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);

  if (remoteMessage.data) {
    await notifee.displayNotification({
      title: remoteMessage.data.title,
      body: remoteMessage.data.body,
      android: {
        channelId: 'default', // Ensure it matches the channel you've created
        importance: AndroidImportance.HIGH,
      },
    });
  }
});

// Register the app component
AppRegistry.registerComponent(appName, () => App);
