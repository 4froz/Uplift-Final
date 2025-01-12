/**
 * @format
 */
import {useNavigation, useNavigationState} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import {
  AppState,
  StatusBar,
  Animated,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import axios from 'axios';
import {getColorsForTheme, server} from '../strings';

const Stack = createStackNavigator();

import messaging from '@react-native-firebase/messaging';

// Screens
import LoginScreen from '../screens/LoginScreen';
import NameScreen from '../screens/NameScreen';
import AgeScreen from '../screens/AgeScreen';
import PersonalHandle from '../screens/PersonalHandleScreen';
import BottomStack from './BottomTab';
import GoalSelector from '../screens/GoalSelector';
import SearchScreen from '../screens/SearchScreen';
import CreatePostScreen from '../screens/CreatePost';
import PostScreen from '../screens/PostScreen';
import MainSearch from '../screens/MainSearchScreen';
import UserProfile from '../screens/UserProfile';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomText from '../../components/CustomText';
import FriendsScreen from '../screens/FriendsScreen';
import notifee, {AndroidImportance} from '@notifee/react-native';
import Sound from 'react-native-sound';
// Foreground Notification Component
const ForegroundNotification = ({title, body, onClose, type, id, name,userId}) => {
  const translateY = useRef(new Animated.Value(-100)).current; // Start from -100 for the up position
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);

  useEffect(() => {
    // Animate to the original position
    Animated.timing(translateY, {
      toValue: 0, // Move to the original position
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // Animate back to the up position
      Animated.timing(translateY, {
        toValue: -100, // Move back up to hide
        duration: 300,
        useNativeDriver: true,
      }).start(onClose);
    }, 4000);

    return () => clearTimeout(timer);
  }, [translateY, onClose]);
  const navigation = useNavigation();
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.disabledColor,
        borderRadius: 8,
        padding: 16,
        zIndex: 1000,
        paddingTop: 40,
        elevation: 5,
        transform: [{translateY}], // Apply the translateY transform
      }}>
      <TouchableOpacity
        onPress={() => {
          onClose();
          if (type == 'message') {
            navigation.navigate('ChatScreen', {
              id: JSON.parse(id),
              user: {name: JSON.parse(name), active: true,_id:JSON.parse(userId)},
            });
          } else if (type == 'notification') {
            navigation.reset({
              index: 0,
              routes: [
                {name: 'BottomTab', params: {screen: 'Notifi', reload: true}},
              ],
            });
          }
        }}
        style={{flexDirection: 'column'}}>
        <CustomText
          style={{
            fontSize: 14,
            fontFamily: 'GeneralSans-SemiBold',
          }}>
          {title}
        </CustomText>
        <CustomText
          style={{
            fontSize: 14,
            fontFamily: 'GeneralSans-Regular',
            marginTop: 5,
          }}>
          {body}
        </CustomText>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MainNav = () => {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
  const navigation = useNavigation(); // Use useNavigation to get the navigation object
  const [isChatScreen, setIsChatScreen] = useState(false);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  useEffect(() => {
   if(themeMode === 'light'){
    StatusBar.setBarStyle('dark-content')
   }else{
    StatusBar.setBarStyle('light-content')
   }
  }, [themeMode])
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', e => {
      const currentRoute = navigation.getCurrentRoute(); // Get the current active route
      console.log(currentRoute.name + ' 🤣❤😍'); // Debugging output

      if (currentRoute.name === 'ChatScreen') {
        setIsChatScreen(true);
      } else {
        setIsChatScreen(false);
      }
    });
    console.warn(isChatScreen);
    // Clean up the listener on component unmount
    return unsubscribe;
  }, [navigation]);
  const userInfo = useSelector(state => state.userInfo);
  const userId = userInfo?._id; // Replace with actual user ID
  const [appState, setAppState] = useState(AppState.currentState);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const updateStatus = async isActive => {
      try {
        await axios.put(`${server}api/user/activeStatus/${userId}/`, {
          active: isActive,
        });
      } catch (error) {
        // console.error('Error updating user status:', error);
      }
    };

    if (userInfo) {
      updateStatus(true);
    }

    Sound.setCategory('Playback');

    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        updateStatus(true);
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        updateStatus(false);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [userId]);

  useEffect(() => {
    const subscribeToUserTopic = async () => {
      if (userInfo) {
        await messaging().subscribeToTopic(`user_${userInfo._id}`);
        console.log(`"Subscribed to topic: user_${userInfo._id}"`);
      }
    };

    subscribeToUserTopic(); // Subscribe whenever app launches
  }, [userInfo]);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const requestPermissions = async () => {
    await notifee.requestPermission();
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  };

  const handleCloseNotification = customKey => {
    setNotification(null);
  };

  const PlaySoundExample = () => {
    // Load the sound file

    // Load the sound file
    const sound = new Sound('n.wav', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }

      // Play the sound
      sound.play(success => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    });

    // Optional: release the sound when done
    sound.setVolume(1);
    sound.setNumberOfLoops(0); // 0 means play once
    // Optionally release when you are done
    sound.release();
  };

  useEffect(() => {
    requestUserPermission();
    createNotificationChannel();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage.data.type);
      if (remoteMessage.data.customKey !== JSON.stringify(userInfo._id)) {
        setNotification({
          title: remoteMessage.data.title,
          body: remoteMessage.data.body,
          customKey: remoteMessage.customKey,
          type: remoteMessage.data.type,
          id: remoteMessage.data.id,
          name: remoteMessage.data.name,
          userId: remoteMessage.data.userId,
        });
        if (!isChatScreen) {
          PlaySoundExample();
        }
      }
    });
    return unsubscribe;
  }, [isChatScreen]);

  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName={userInfo?.name === 'Nologin' ? 'Login' : 'BottomTab'}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animationEnabled: true,
          cardStyle: {backgroundColor: '#000'},
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: {animation: 'timing', config: {duration: 200}},
            close: {animation: 'timing', config: {duration: 200}},
          },
          cardStyleInterpolator: ({current, layouts}) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}>
        <Stack.Screen name="BottomTab" component={BottomStack} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Age" component={AgeScreen} />
        <Stack.Screen name="PersonalHandle" component={PersonalHandle} />
        <Stack.Screen name="Goal" component={GoalSelector} />
        <Stack.Screen
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
          name="CreatePost"
          component={CreatePostScreen}
        />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="MainSearch" component={MainSearch} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
      </Stack.Navigator>
      {!isChatScreen ? (
        <>
          {notification && (
            <ForegroundNotification
              title={notification.title}
              body={notification.body}
              type={notification.type}
              id={notification.id}
              onClose={handleCloseNotification}
              name={notification.name}userId={notification.userId}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};
