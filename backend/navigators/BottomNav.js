import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CreateScreen from '../screens/CreateScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image, View,TouchableOpacity} from 'react-native';
import {Svg} from 'react-native-svg';
import MyProfileScreen from '../screens/MyProfileScreen';
import {useNavigation} from '@react-navigation/native';
import CreatePostScreen from '../screens/CreatePostScreen';
import { useSelector } from 'react-redux';
const Tab = createBottomTabNavigator();

const BottomStack = () => {
  const userLogin = useSelector(state => state.userLogin);
  const {userInfo} = userLogin;
  const navigation = useNavigation();

  // );
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 10,
          borderTopWidth: 0.2,
          backgroundColor: '#101010',
          height: 60,
        },
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Image
                  source={require('../assets/home1.png')}
                  style={{width: 30, height: 30,tintColor:"#fff"}}
                />
              ) : (
                <Image
                  source={require('../assets/home.png')}
                  style={{width: 25, height: 25}}
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
        name="Search"
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Icon name="search" color="#fff" size={30} />
              ) : (
                <Icon name="search-outline" color="#3E3E42" size={30} />
              )}
            </View>
          ),
          headerShown: false,
        }}
        component={SearchScreen}
      />
      <Tab.Screen
        name="Create"
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Icon name="add-circle" color="#fff" size={30} />
              ) : (
                <Icon name="add-circle-outline" color="#404040" size={30} />
              )}
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Home")} activeOpacity={0.7}>
              <Icon
                name="close-outline"
                size={25}
                style={{marginLeft: 2, marginRight: 15}}
                color="#fff"
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#101010",
          },
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'ProximaNova-Regular',
          },
          title: 'Start a Snippet',
          animation: 'flip',
        }}
        component={CreateScreen}
      />
      <Tab.Screen
        name="Notifi"
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Icon name="heart" color="#fff" size={30} />
              ) : (
                <Icon name="heart-outline" color="#3E3E42" size={30} />
              )}
            </View>
          ),
          headerShown: false,
        }}
        component={NotificationScreen}
      />
      <Tab.Screen
        name="MyProfile"
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {focused ? (
                <Icon name="person-circle" color="#fff" size={30} />
              ) : (
                <Icon name="person-circle-outline" color="#3E3E42" size={30} />
              )}
            </View>
          ),
          headerShown: false,
        }}
        component={MyProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomStack;
