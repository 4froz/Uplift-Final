import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import BlastedImage from 'react-native-blasted-image';
import {useSelector} from 'react-redux';
import io from 'socket.io-client';
import {useFocusEffect} from '@react-navigation/native';
import Na from 'react-native-system-navigation-bar';
import Comment from '../../components/Comment';
import CustomText from '../../components/CustomText';
import {server, getColorsForTheme} from '../strings';
import GestureRecognizer from 'react-native-swipe-gestures';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import ChatCard from '../components/ChatCard';

const socket = io(`${server}`);
const ChatScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [scrollloading, setscrollloading] = useState(false);
  const [community, setCommunity] = useState({});
  const userInfo = useSelector(state => state.userInfo);
  const [chats, setchats] = useState([]);
  const [show, setshow] = useState(false);
  const [reply, setreply] = useState('');
  const scrollViewRef = useRef(null);
  const [active, setActive] = useState(false);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  useEffect(() => {
    // Join socket room for real-time updates
    socket.emit('joinRoom', 'update');

    // Listen for new posts from socket
    socket.on('updateActiveStatus', data => {
      if (data.updatedUser._id === route.params.user._id) {
        console.log('^&*(' + data.updatedUser._id);

        setActive(data.updatedUser.active);
      }
    });

    return () => {
      // Cleanup socket connection on unmount
      socket.off('update');
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      setscrollloading(true); // Set loading to true before scrolling
      scrollViewRef.current.scrollTo({y: 99999, animated: true}); // Scroll to bottom

      // Use setTimeout to simulate the scrolling completion
      const timeoutId = setTimeout(() => {
        setscrollloading(false); // Set loading to false after scrolling is assumed to be complete
      }, 1000); // Adjust the duration (300ms is a rough estimate; you can tweak it based on your animation duration)

      // Clean up timeout if the component is unmounted before timeout completes
      return () => clearTimeout(timeoutId);
    }
  }, [chats]);
  const {id} = route.params;

  useEffect(() => {
    try {
      // Join socket room based on community ID
      socket.emit('joinRoom', `${id}`);

      // Emit markSeen event to backend when chat screen is opened
      socket.emit('markSeen', {communityId: id, userId: userInfo._id});

      // Listen for new chat messages
      socket.on('addchat', data => {
        if (data.user._id !== userInfo._id) {
          setchats(prevChats => [...prevChats, data]);
        }
      });

      return () => {
        // Clean up socket connection on component unmount
        socket.off('addchat');
      };
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const getCommunity = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.get(`${server}api/community/main/${id}`);
      const {data} = response;
      // setCommunity(data);
      setchats(data.chats);
      setLoading(false);
    } catch (error) {
      console.error('Error logging in:', error.message);
      // alert(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommunity();
  }, [id]);

  useEffect(() => {
    setActive(route.params.user?.active);
  }, [route.params.user]);

  
  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.appColor,
            padding: 5,
            justifyContent: 'center',
          }}>
          <ActivityIndicator
            size={50}
            color={colors.mainColor}
            style={{borderRadius: 100}}
          />
          <View
            style={{
              position: 'absolute',
              width: 38,
              height: 38,
              backgroundColor: colors.appColor,
              alignSelf: 'center',
              borderRadius: 100,
            }}
          />
        </View>
      ) : (
        <View style={{flex: 1, backgroundColor: colors.appColor}}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              marginTop: 20,
              marginRight: 15,
              marginTop: 15,
              padding: 12,
              paddingVertical: 15,
              paddingTop: 20,
              paddingBottom: 10,
              borderColor: colors.disabledColor,
              borderBottomWidth:1
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('BottomTab', {screen: 'Home'})}
              activeOpacity={0.7}>
              <Icon
                name="arrow-back"
                size={20}
                style={{marginLeft: 2, marginRight: 15}}
                color={colors.mainTextColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('UserProfile', {id: route.params.user._id})
              }
              style={{marginLeft: 10}}>
              <CustomText
                style={{
                  fontSize: 16,
                  alignSelf: 'flex-start',
                  fontFamily: 'GeneralSans-SemiBold',
                }}>
                {route?.params?.user?.name}
              </CustomText>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 2,
                }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: active ? '#00A67E' : colors.secondaryColor,
                    borderRadius: 10,
                    marginRight: 4,
                  }}
                />
                <CustomText
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontFamily: 'GeneralSans-Medium',
                    width: '80%',
                    color: active ? '#00A67E' : colors.secondaryColor,
                    // minWidth:"20%"
                  }}>
                  {active ? 'Online' : 'Offline'}
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({})}
            contentContainerStyle={{
              padding: 12,
              marginTop: 0,
            }}>
            <View style={{marginBottom: 100}}>
              {chats.map((item, i) => (
               <ChatCard setReply={setreply} item={item} key={i} />
              ))}
            </View>
          </ScrollView>
          <Comment
            details={route.params.user}
            messageUser={route.params.user}
            reply={reply}
            setReply={setreply}
            setCommunity={setchats}
            id={id}
          />
        </View>
      )}
    </>
  );
};

export default ChatScreen;
