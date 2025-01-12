import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import {
  Image,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  BackHandler,
} from 'react-native';
import Na from 'react-native-system-navigation-bar';
import {useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../redux/UserSlice';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {getColorsForTheme} from '../strings';

const Tab = createBottomTabNavigator();

const BottomStack = () => {
  const [loading, setLoading] = useState();
  const navigation = useNavigation();
  const themeMode = useSelector(state => state.theme.themeMode);
  
  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  const dispatch = useDispatch();
  Na.setNavigationColor(colors.appColor);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1059186875993-vn7j67lgreb7p9b25sqeu5e4isi14qmk.apps.googleusercontent.com', // Replace with your web client ID
    });

    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);

  const loginUser = async (email, idToken, name) => {
    console.log(email);

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(
        `https://68de-2409-40c2-4001-748c-dd98-9a25-23a2-ed68.ngrok-free.app/api/user/`,
        {
          email,
          password: idToken,
          name: name,
        },
      );
      const {data} = response;
      dispatch(login(data));
      ToastAndroid.show('Login Success', 1000);
      Alert.alert(
        'Restart Required',
        'In order to save changes, you need to restart the app.',
        [
          {
            text: 'OK',
            onPress: () => {
              BackHandler.exitApp(); // This will close the app
            },
          },
        ],
        {cancelable: false}, // Make the alert non-cancelable
      );
      setLoading(false);
      navigation.navigate('BottomTab');
    } catch (error) {
      console.error('Error logging in:', error.message);
      Alert.alert(error.message, 'Please Recheck you Email And Password');
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign out of any previously signed-in accounts
      await GoogleSignin.signOut();

      // Initiate sign-in, this will now prompt user to select an account
      const userInfo = await GoogleSignin.signIn();

      loginUser(
        userInfo.data.user.email,
        userInfo.data.idToken,
        userInfo.data.user.name,
      );

      // Handle user info
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        Alert.alert(error.message);
      }
    }
  };

  // );
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0.2,
          backgroundColor: colors.bottomwhiteColor,
          height: 65,
          paddingTop: 10,
          paddingBottom: 10,
          borderTopColor: '#181818',
          position: 'absolute',
          bottom: 15,
          width: '95%',
          left: '2.5%', // Position it from the left
          right: '2.5%', // Ensures it's centered by equally spacing left and right
          borderRadius: 40,
          elevation: 3,
          paddingHorizontal: 10,
        },
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/9664/9664027.png',
                  }}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: colors.mainTextColor,
                  }}
                />
              ) : (
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/9664/9664027.png',
                  }}
                  style={{width: 25, height: 25, tintColor: '#8c9195'}}
                />
              )}
            </View>
          ),
          headerShown: false,
        }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Chat"
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/9071/9071532.png',
                  }}
                  style={{
                    width: 22,
                    height: 22,
                    tintColor: colors.mainTextColor,
                  }}
                />
              ) : (
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/9071/9071532.png',
                  }}
                  style={{width: 22, height: 22, tintColor: '#8c9195'}}
                />
              )}
            </View>
          ),
          headerShown: false,
        }}
        component={MessageScreen}
      />
      <Tab.Screen
        name="Create"
        options={{
          tabBarIcon: ({focused}) => (
            <View onPress={() => navigation.navigate('CreatePost')}>
              {focused ? (
                <View
                  style={{
                    backgroundColor: colors.mainColor,
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="add" style={{}} color={'#000'} size={25} />
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: colors.mainColor,
                    width: 35,
                    height: 35,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="add" style={{}} color={'#000'} size={25} />
                </View>
              )}
            </View>
          ),
          headerShown: false,
        }}
        component={CreatePostScreen}
      />
      {/* <Tab.Screen
      //   name="Profi"
      //   options={{
      //     tabBarIcon: ({focused}) => (
      //       <View style={{justifyContent: 'center', alignItems: 'center'}}>
      //         {focused ? (
      //           <Icon name="person" color="#000" size={30} />
      //         ) : (
      //           <Icon name="person-outline" color="#3E3E42" size={30} />
      //         )}
      //       </View>
      //     ),
      //     headerShown: false,
      //   }}
      //   component={SearchScreen}
      // /> */}

      <Tab.Screen
        name="Notifi"
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Icon
                  name="notifications"
                  color={colors.mainTextColor}
                  size={22}
                />
              ) : (
                <Icon name="notifications" color="#8c9195" size={22} />
              )}
            </View>
          ),
          headerShown: false,
        }}
        initialParams={{ reload:false }}
        component={NotificationScreen}
      />

      <Tab.Screen
        name="MyProfile"
        options={{
          // tabBarButton: props => (
          //   <TouchableOpacity
          //     {...props}
          //     onPress={() => navigation.navigate('MyProfile')} // Navigate to MyProfileScreen on press
          //     onLongPress={() => signInWithGoogle()} // Handle the long press event
          //     style={{
          //       justifyContent: 'center',
          //       alignItems: 'center',
          //       flex: 1,
          //     }}>
          //     {props.focused ? (
          //       <Icon name="person" color={colors.mainTextColor} size={22} />
          //     ) : (
          //       <Icon name="person" color="#8c9195" size={22} />
          //     )}
          //   </TouchableOpacity>
          // ),
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Icon name="person" color={colors.mainTextColor} size={22} />
              ) : (
                <Icon name="person" color="#8c9195" size={22} />
              )}
            </View>
          ),
          headerShown: false,
        }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomStack;
