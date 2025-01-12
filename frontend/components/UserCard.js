import {View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import CustomText from './CustomText';
import axios from 'axios';
import UnfriendModal from './UnfriendModal';
import moment from 'moment';
import {getColorsForTheme, server} from '../2.0/strings';
import {io} from 'socket.io-client';
const socket = io(`${server}`);
const UserCard = ({
  user,
  notification,
  getRequests,
  friendsScreen,
  myfriends,
  getUser,
  chatScreen,
}) => {
  const navigation = useNavigation();
  const userInfo = useSelector(state => state.userInfo);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [unfriendModal, setUnfriendModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [active, setActive] = useState(false);

  function getCustomTimeFormat(date) {
    const now = moment();
    const duration = moment.duration(now.diff(moment(date)));
    const seconds = Math.floor(duration.asSeconds());
    const minutes = Math.floor(duration.asMinutes());
    const hours = Math.floor(duration.asHours());
    const days = Math.floor(duration.asDays());

    if (seconds < 60) return 'now'; // Less than a minute, return 'now'
    if (minutes < 60) return `${minutes}m`; // Less than an hour, return 'Xm'
    if (hours < 24) return `${hours}h`; // Less than a day, return 'Xh'
    return `${days}d`; // Else return 'Xd'
  }

  const gethchatUser = useCallback(async () => {
    if (user.to && user.from) {
      try {
        setLoading(true);
        const response = await axios.get(
          `${server}api/user/${
            user.from == userInfo._id
              ? user.to
              : user.to == userInfo._id
              ? user.from
              : {}
          }`,
        );
        setDetails(response.data);
        console.log(response.data._id + 'hat');
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [user.from, user.to]);

  const acceptRequest = useCallback(async () => {
    try {
      setLoadingRequest(true);
      const response = await axios.post(
        `${server}api/user/accept/${userInfo._id}`,
        {acceptUser: user._id},
      );
      getRequests(); // Refresh the requests after accepting
    } catch (error) {
      console.error('Error accepting request:', error.message);
    } finally {
      setLoadingRequest(false);
    }
  }, [userInfo._id, user._id, getRequests]);

  const rejectRequest = useCallback(async () => {
    try {
      setLoadingRequest(true);
      const response = await axios.post(
        `${server}api/user/request/${userInfo._id}`,
        {requestUserId: user._id},
      );
      getRequests(); // Refresh the requests after rejecting
    } catch (error) {
      console.error('Error rejecting request:', error.message);
    } finally {
      setLoadingRequest(false);
    }
  }, [userInfo._id, user._id, getRequests]);

  useEffect(() => {
    setActive(details?.active);
  }, [details]);

  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  useEffect(() => {
    if (chatScreen) {
      gethchatUser();
    }
  }, [user.from, user.to, chatScreen]);

  useEffect(() => {
    // Join socket room for real-time updates
    socket.emit('joinRoom', 'update');

    // Listen for new posts from socket
    const updateStatusListener = data => {
      if (data?.updatedUser && data.updatedUser._id) {
        // Check if updatedUser and _id exist
        console.log(data.updatedUser.name + ' milano');

        if (data.updatedUser._id === details?._id) {
          // Use optional chaining
          console.log('Updated active status for user:', data.updatedUser._id);
          setActive(data.updatedUser.active);
        }
      } else {
        console.warn('Received invalid data from socket:', data); // Log warning for invalid data
      }
    };

    socket.on('updateActiveStatus', updateStatusListener);

    return () => {
      // Cleanup socket connection on unmount
      socket.off('updateActiveStatus', updateStatusListener); // Remove specific listener
    };
  }, [details]);

  // console.log(details.active);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading || loadingRequest}
      onPress={() => {
        if (chatScreen) {
          navigation.navigate('ChatScreen', {id: user._id, user: details});
        } else {
          userInfo._id !== user._id &&
            navigation.navigate('UserProfile', {id: user._id});
        }
      }}
      style={{
        flexDirection: 'column',
        backgroundColor: chatScreen ? 'transparent' : colors.disabledColor,
        elevation: chatScreen ? 0 : 0,
        shadowColor: '#000',
        width: '100%',
        padding: chatScreen ? 0 : 15,
        alignItems: 'center',
        paddingVertical: chatScreen ? 10 : 20,
        borderColor: chatScreen ? colors.disabledColor : '#202020',
        marginTop: 15,
        borderRadius: 10,
        borderBottomWidth: chatScreen ? 1 : 0,
        // paddingBottom: 2,
      }}>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            style={{borderRadius: 100}}
            size={40}
            color={colors.mainColor}
          />
          <View
            style={{
              position: 'absolute',
              width: 30,
              height: 30,
              backgroundColor: chatScreen ? colors.appColor : colors.appColor,
              alignSelf: 'center',
              borderRadius: 100,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: chatScreen ? 'flex-start' : 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Image
            style={{
              width: chatScreen ? 45 : 40,
              height: chatScreen ? 45 : 40,
              borderRadius: chatScreen ? 50 : 5,
              borderWidth: chatScreen ? 0 : 1,
              borderColor: '#fff',
              backgroundColor: '#404040',
            }}
            source={{
              uri:
                chatScreen && details?.profilePic
                  ? details?.profilePic
                  : user?.profilePic ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              width: friendsScreen || myfriends ? '65%' : '80%',
            }}>
            <CustomText
              style={{
                fontSize: 14,
                fontFamily: 'GeneralSans-SemiBold',
              }}>
              {user?.name || details?.name}
            </CustomText>
            {chatScreen ? (
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
            ) : (
              <CustomText
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'GeneralSans-Regular',
                  marginTop: 2,
                }}>
                {user?.username}
              </CustomText>
            )}
            {/* {!notification && (
              <CustomText
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'GeneralSans-Regular',
                  marginTop: 2,
                }}>
                {user?.bio}
              </CustomText>
            )} */}
            {notification && (
              <View
                style={{
                  width: '80%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                {loadingRequest ? (
                  <ActivityIndicator size={10} color={'#BB2B00'} />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={acceptRequest}
                      style={{
                        width: '48%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#181818',
                        borderRadius: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                      }}>
                      <CustomText
                        style={{
                          fontSize: 14,
                          color: 'lightgreen',
                          fontFamily: 'GeneralSans-SemiBold',
                        }}>
                        Accept
                      </CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={rejectRequest}
                      style={{
                        width: '48%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#181818',
                        borderRadius: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                      }}>
                      <CustomText
                        style={{
                          fontSize: 14,
                          color: '#d1123f',
                          fontFamily: 'GeneralSans-SemiBold',
                        }}>
                        Reject
                      </CustomText>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>

          {friendsScreen && (
            <Icon name="person-outline" color="#a6a6a6" size={20} />
          )}

          {myfriends && (
            <TouchableOpacity
              style={{
                width: 40,
                height: 30,
                backgroundColor: colors.appColor,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setUnfriendModal(true)}>
              <Icon name="person-remove" color="#a6a6a6" size={15} />
            </TouchableOpacity>
          )}

          <UnfriendModal
            user={user}
            show={unfriendModal}
            setShow={setUnfriendModal}
            getUser={getUser}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(UserCard);
