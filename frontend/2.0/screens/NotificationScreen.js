import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard';
import CustomText from '../../components/CustomText';
import {getColorsForTheme, server} from '../strings';
import moment from 'moment';

const NotificationScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [notificationloading, setnotificationloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState(null);
  const [notifications, setnotifications] = useState(null);
  const userInfo = useSelector(state => state.userInfo);
  const themeMode = useSelector(state => state.theme.themeMode);
  function getCustomTimeFormat(date) {
    const now = moment();
    const duration = moment.duration(now.diff(moment(date)));

    const seconds = Math.floor(duration.asSeconds());
    const minutes = Math.floor(duration.asMinutes());
    const hours = Math.floor(duration.asHours());
    const days = Math.floor(duration.asDays());

    if (seconds < 60) return 'now ago'; // Less than a minute, return 'now'
    if (minutes < 60) return `${minutes}m ago`; // Less than an hour, return 'Xm'
    if (hours < 24) return `${hours}h ago`; // Less than a day, return 'Xh'
    return `${days}d ago`; // Else return 'Xd'
  }
  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  // Use useCallback to memoize the function and avoid re-creation on every render
  const getUserRequests = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true when the request starts
      const response = await axios.get(
        `${server}api/user/request/${userInfo._id}`,
      );
      setUsers(response.data.requests); // Set the received data in state
    } catch (error) {
      console.error('Error fetching user requests:', error.message);
    } finally {
      setLoading(false); // Always set loading to false after the request is done
    }
  }, [userInfo._id]);

  console.log(route.params.reload + '12333333333333333');
  useEffect(() => {

    if (route.params.reload == true) {
      setLoading(true);
     
        getUserRequests()
        getNotifications();
     
    }
  }, [route.params?.reload]);

  const getNotifications = useCallback(async () => {
    try {
      setnotificationloading(true); // Set loading to true when the request starts
      const response = await axios.get(
        `${server}api/notification/${userInfo._id}`,
      );
      const filterednotifi = response.data.filter(
        notification => notification.user._id !== userInfo._id,
      );
      setnotifications(filterednotifi); // Set the received data in state
    } catch (error) {
      console.error('Error fetching user requests:', error.message);
    } finally {
      setnotificationloading(false); // Always set loading to false after the request is done
    }
  }, [userInfo._id]);

  // Fetch user requests on component mount
  useEffect(() => {
    getUserRequests();
    getNotifications();
  }, []);
  return (
    <>
      {loading || refreshing || notificationloading ? (
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
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  getUserRequests();
                  getNotifications();
                }}
              />
            }
            contentContainerStyle={{paddingBottom: 200}}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.appColor,
                // paddingHorizontal: 16,
              }}>
              {users?.length == 0 && !loading ? (
                <CustomText
                  bold
                  style={{
                    fontSize: 16,
                    fontFamily: 'GeneralSans-SemiBold',
                    marginTop: 40,
                    marginLeft: 16,
                  }}>
                  No notifications
                </CustomText>
              ) : (
                <CustomText
                  bold
                  style={{
                    fontSize: 16,
                    fontFamily: 'GeneralSans-SemiBold',
                    marginTop: 40,
                    marginLeft: 16,
                  }}>
                  Notifications
                </CustomText>
              )}
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.appColor,
                  paddingHorizontal: 16,
                  marginTop:
                    users?.length == 0 && notifications?.length == 0 ? 40 : 0,
                }}>
                {users?.map(user => (
                  <NotificationCard
                    getRequests={getUserRequests}
                    key={user._id}
                    user={user}
                  />
                ))}
                {/* <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('UserProfile', {id: user._id})
                  }
                  style={{
                    flexDirection: 'column',
                    backgroundColor: colors.disabledColor,
                    elevation: 0,
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
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#fff',
                        backgroundColor: '#404040',
                      }}
                      source={{
                        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '65%',
                      }}>
                      <CustomText
                        style={{
                          fontSize: 14,
                          fontFamily: 'GeneralSans-SemiBold',
                        }}>
                        Afroz liked your post
                      </CustomText>
                      <CustomText
                        style={{
                          fontSize: 14,
                          fontFamily: 'GeneralSans-Medium',
                          color: colors.secondaryColor,
                        }}>
                        "Milana"
                      </CustomText>
                    </View>

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
                        uri: 'https://pbs.twimg.com/amplify_video_thumb/1754150313458905088/img/5xcBvx5_fW4BUf1V.jpg',
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('UserProfile', {id: user._id})
                  }
                  style={{
                    flexDirection: 'column',
                    backgroundColor: colors.disabledColor,
                    elevation: 0,
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
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#fff',
                        backgroundColor: '#404040',
                      }}
                      source={{
                        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '65%',
                      }}>
                      <CustomText
                      numberOfLines={1}
                        style={{
                          fontSize: 14,
                          fontFamily: 'GeneralSans-SemiBold',
                        }}>
                        Afroz commented on your post
                      </CustomText>
                      <CustomText
                        style={{
                          fontSize: 14,
                          fontFamily: 'GeneralSans-Medium',
                          color: colors.secondaryColor,
                        }}>
                        Sexy lady
                      </CustomText>
                    </View>

                    <TouchableOpacity
                      style={{
                        alignItems: 'flex-end',
                      }}>
                      <CustomText
                        style={{
                          fontFamily: 'GeneralSans-Medium',
                          fontSize: 14,
                          alignSelf: 'flex-start',
                          color: colors.secondaryColor,
                        }}>
                        View 
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity> */}

                {notifications?.map(item => (
                  <TouchableOpacity
                    activeOpacity={1}
                    // onPress={() =>
                    //   navigation.navigate('UserProfile', {id: user._id})
                    // }
                    style={{
                      flexDirection: 'column',
                      backgroundColor: colors.disabledColor,
                      elevation: 0,
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
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('UserProfile', {
                            id: item.user._id,
                          })
                        }>
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: '#fff',
                            backgroundColor: '#404040',
                          }}
                          source={{
                            uri:
                              item.user.profilePic ||
                              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
                          }}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '65%',
                        }}>
                        {item.type == 'like' ? (
                          <>
                            <CustomText
                              numberOfLines={1}
                              style={{
                                fontSize: 14,
                                fontFamily: 'GeneralSans-SemiBold',
                              }}>
                              {item.user.name} liked your post
                            </CustomText>
                            <CustomText
                              style={{
                                fontSize: 14,
                                fontFamily: 'GeneralSans-Medium',
                                color: colors.secondaryColor,
                              }}>
                              {item.post.desc}
                            </CustomText>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                              }}>
                              <CustomText
                                numberOfLines={1}
                                style={{
                                  color: '#a6a6a6',

                                  marginTop: 5,
                                  fontSize: 12,
                                  fontFamily: 'GeneralSans-Regular',
                                }}>
                                {getCustomTimeFormat(item.createdAt)}
                              </CustomText>
                            </View>
                          </>
                        ) : (
                          <>
                            <CustomText
                              numberOfLines={1}
                              style={{
                                fontSize: 14,
                                fontFamily: 'GeneralSans-SemiBold',
                              }}>
                              {item.user.name} commented on your post
                            </CustomText>
                            <CustomText
                              numberOfLines={2}
                              style={{
                                fontSize: 14,
                                marginTop: 5,
                                fontFamily: 'GeneralSans-Medium',
                                color: colors.secondaryColor,
                              }}>
                              {item.comment}
                            </CustomText>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                              }}>
                              <CustomText
                                numberOfLines={1}
                                style={{
                                  color: '#a6a6a6',
                                  fontSize: 12,
                                  marginTop: 5,

                                  fontFamily: 'GeneralSans-Regular',
                                }}>
                                {getCustomTimeFormat(item.createdAt)}
                              </CustomText>
                            </View>
                          </>
                        )}
                      </View>
                      {item.post.image ? (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('PostScreen', {
                              id: item.post._id,
                            })
                          }
                          style={{
                            alignItems: 'flex-end',
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
                              uri: item.post.image,
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('PostScreen', {
                              id: item.post._id,
                            })
                          }
                          style={{
                            alignItems: 'flex-end',
                          }}>
                          <CustomText
                            style={{
                              fontFamily: 'GeneralSans-Medium',
                              fontSize: 14,
                              alignSelf: 'flex-start',
                              color: colors.secondaryColor,
                            }}>
                            View
                          </CustomText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default NotificationScreen;
