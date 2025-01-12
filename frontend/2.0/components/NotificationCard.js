import {View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import CustomText from '../../components/CustomText';
import { getColorsForTheme,server } from '../strings';

const NotificationCard = ({user,getRequests}) => {
  const navigation = useNavigation();
  const userInfo = useSelector(state => state.userInfo);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [unfriendModal, setUnfriendModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
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

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading || loadingRequest}
      onPress={() => navigation.navigate('UserProfile', {id: user._id})}
      style={{
        flexDirection: 'column',
        backgroundColor: colors.disabledColor,
        elevation:   0,
        shadowColor: '#000',
        width: '100%',
        padding: 15,
        alignItems: 'center',
        paddingVertical: 20,
        borderColor: '#404040',
        marginTop: 15,
        borderRadius: 10,
        borderBottomWidth: 0,
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
              backgroundColor: '#181818',
              alignSelf: 'center',
              borderRadius: 100,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#fff',
              backgroundColor: '#404040',
            }}
            source={{
              uri:
                user?.profilePic ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              width:  '80%',
            }}>
            <CustomText
              style={{
         
                fontSize: 14,
                fontFamily: 'GeneralSans-SemiBold',
              }}>
              {user?.name}
            </CustomText>

            <View
              style={{
                width: '80%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              {loadingRequest ? (
                <ActivityIndicator size={10} color={colors.mainColor} />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={acceptRequest}
                    style={{
                      width: '48%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:colors.appColor,
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
                      backgroundColor:colors.appColor,
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
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(NotificationCard);
