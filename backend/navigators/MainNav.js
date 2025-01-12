import React, {useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNav from '../navigators/BottomNav';
import {Alert, StatusBar, View} from 'react-native';
import PostScreen from '../screens/PostScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import CommentScreen from '../screens/CommentScreen';
import SearchDetailScreen from '../screens/SearchDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import CreatePostScreen from '../screens/CreatePostScreen';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import NameScreen from '../screens/Auth/NameScreen';
import IdScreen from '../screens/Auth/IdScreen';
import StdDivScreen from '../screens/Auth/StdDivScreem';
import ProfilePicScreen from '../screens/Auth/ProfilePicScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUp from '../screens/Auth/SignUpScreen';
import {useSelector} from 'react-redux';
import FollowersScreen from '../screens/FollowersScreen';
import {maincolor} from '../colors';
import EditProfileScreen from '../screens/EditProfileScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import MessageScreen from '../screens/MessageScreen';
import PostScreen2 from '../screens/PostScreen2';

const MainNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  const [con, setCon] = useState(true);
  const tempUser = useSelector(state => state.tempUser);
  const userLogin = useSelector(state => state.userLogin);
  const {userInfo, error} = userLogin;

  return (
    <View style={{flex: 1, backgroundColor: maincolor}}>
      <Stack.Navigator
        initialRouteName={userInfo ? 'BottomNav' : 'Welcome'}
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardOverlay: () => (
            <View
              style={{
                flex: 1,
                backgroundColor: maincolor,
              }}
            />
          ),
        }}>
        <Stack.Screen
          options={{headerShown: false}}
          name="BottomNav"
          component={BottomNav}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: maincolor,
            },
            headerTitleStyle: {
              color: '#fff',
              fontFamily: 'ProximaNova-Regular',
            },
          }}
          name="Post"
          component={PostScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: maincolor,
            },
            headerTitleStyle: {
              color: '#fff',
              fontFamily: 'ProximaNova-Regular',
            },
            title: 'Reply',
            animation: 'flip',
          }}
          name="Replies"
          component={CommentScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: maincolor,
            },
            headerTitleStyle: {
              color: '#fff',
              fontFamily: 'ProximaNova-Regular',
            },
            title: 'Start a Snippet',
            animation: 'none',
          }}
          name="CreatePost"
          component={CreatePostScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            animation: 'flip',
          }}
          name="SearchDetail"
          component={SearchDetailScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Welcome"
          component={WelcomeScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Id"
          component={IdScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Name"
          component={NameScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="StdDiv"
          component={StdDivScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="ProfilePic"
          component={ProfilePicScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: maincolor,
            },
          }}
          name="Follower"
          component={FollowersScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: maincolor,
            },
          }}
          name="EditProfile"
          component={EditProfileScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="ForgotPass"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Message"
          component={MessageScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: "rgba(16, 16, 16, 0.3)",
            },
            headerTitleStyle: {
              color: '#fff',
              fontFamily: 'ProximaNova-Regular',
            },
            headerTitle:"Post"
          }}
          name="Post2"
          component={PostScreen2}
        />
      </Stack.Navigator>
      {/* {con && (
        <TouchableOpacity
        onPress={() => {navigation.navigate('CreatePost');setCon(false)}}
        style={{
          position: 'absolute',
          bottom: 22,
          alignSelf: 'center',
        }}>
        <Icon name="create-outline" color="#404040" size={30} />
      </TouchableOpacity>
      )} */}
    </View>
  );
};

export default MainNav;
