import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {getColorsForTheme, server} from '../strings';
import CustomText from '../../components/CustomText';
import PostCard from '../components/PostCard';

const UserProfile = ({navigation, route}) => {
  const {id} = route.params;
  const [loading, setLoading] = useState(true);
  const [loadingrequest, setLoadingRequest] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails] = useState(null);
  const [users, setUsers] = useState(null);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  const userInfo = useSelector(state => state.userInfo);

  const userRequest = useMemo(
    () => ({
      name: userInfo.name,
      _id: userInfo._id,
      profilePic: userInfo.profilePic,
    }),
    [userInfo],
  );

  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}api/user/${id}`);
      setDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getUserRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${server}api/user/request/${userInfo._id}`,
      );
      setUsers(response.data.requests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user requests:', error.message);
    } finally {
      setLoading(false);
    }
  }, [userInfo._id]);

  const [contacts, setcontacts] = useState(null);
  const getUserContacts = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true when the request starts
      const response = await axios.put(`${server}api/community`, {
        id: userInfo._id,
      });
      setcontacts(response.data);
      setLoading(false);
      // Set the received data in state
    } catch (error) {
      console.error('Error fetching user contacts:', error);
    } finally {
      setLoading(false); // Always set loading to false after the request is done
    }
  }, [userInfo._id]);

  const sendReuest = useCallback(async () => {
    try {
      setLoadingRequest(true);
      await axios.put(`${server}api/user/request/${id}`, {
        requestUser: userRequest,
      });
      await getUser();
      setLoading(false);
    } catch (error) {
      console.error('Error sending friend request:', error.message);
    } finally {
      setLoadingRequest(false);
    }
  }, [id, getUser, userRequest]);

  const acceptRequest = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post(`${server}api/user/accept/${userInfo._id}`, {
        acceptUser: details._id,
      });
      await getUser();
    } catch (error) {
      console.error('Error accepting friend request:', error.message);
    } finally {
      setLoading(false);
    }
  }, [details, getUser, userInfo._id]);

  const [_post, set_post] = useState([]);
  const getRandomPost = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${server}api/posts/user/${id}`);
      console.log(response.data);

      setLoading(false);
      set_post(response.data.post);
    } catch (error) {
      Alert.alert(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserRequests();
    getUser();
    getUserContacts();
    getRandomPost();
  }, [id, getUser, getUserRequests]);

  const isFriend = useMemo(
    () => details?.friends?.find(req => req._id === userInfo._id),
    [details, userInfo._id],
  );
  const hasPendingRequest = useMemo(
    () => details?.requests?.find(req => req._id === userInfo._id),
    [details, userInfo._id],
  );
  const userExists = useMemo(
    () => users?.find(req => req._id === id),
    [users, id],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUser().finally(() => setRefreshing(false));
  }, [getUser]);

  const createCommunity = async banner => {};

  const handleMessagePress = async () => {
    // Check if contacts is properly populated
    console.log('Contacts:', contacts);

    const existingCommunity = contacts?.find(
      community =>
        (community.from === details._id && community.to === userInfo._id) ||
        (community.to === details._id && community.from === userInfo._id),
    );

    console.log('Existing Community:', existingCommunity);

    if (existingCommunity) {
      // If community exists, navigate to the chat screen with community ID
      console.log(
        'Navigating to existing community chat:',
        existingCommunity._id,
      );
      navigation.navigate('ChatScreen', {
        id: existingCommunity._id,
        user: details,
      });
    } else {
      try {
        console.log('No existing community, creating new one...');
        setLoading(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await axios.post(
          `${server}api/community`,
          {
            from: userInfo._id,
            to: details._id,
          },
          config, // Include headers in the request
        );
        const {data} = response;
        console.log('New community created:', data);
        setLoading(false);
        navigation.navigate('ChatScreen', {id: data._id, user: details});
      } catch (error) {
        console.error('Error creating new community:', error.message);
        alert(error.message); // Provide a more informative error alert
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading || refreshing ? (
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
                  getUser();
                  getUserContacts();
                }}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}>
            <View style={{width: '100%', paddingTop: 70}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 50,
                  marginLeft: 16,
                  // backgroundColor: colors.appColor,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <Image
                  source={{
                    uri:
                      details?.profilePic ||
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
                  }}
                  style={{width: '100%', height: '100%', borderRadius: 50}}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                  position: 'absolute',
                  top: 25,
                  paddingHorizontal: 16,
                }}>
                {/* <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      padding: 10,
                      borderRadius: 15,
                      paddingVertical: 7,
                      backgroundColor: '#0267B3',
                      paddingHorizontal: 12,
                      borderRadius: 20,
                    }}>
                    <CustomText
                      style={{
                        fontSize: 14,

                        fontFamily: 'GeneralSans-Medium',
                      }}>
                      {details?.mood
                        ? details.mood.charAt(0).toUpperCase() +
                 
                          details.mood.slice(1)
                        : 'Your mood'}
                    </CustomText>
                  </TouchableOpacity> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    paddingBottom: 15,
                    borderColor: colors.disabledColor,
                    borderBottomWidth: 1.5,
                  }}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                      alignItems: 'flex-end',
                    }}>
                    <Icon
                      name="arrow-back"
                      size={20}
                      style={{marginLeft: 2, marginRight: 15}}
                      color={colors.mainTextColor}
                    />
                  </TouchableOpacity>

                  <CustomText
                    style={{
                      fontSize: 18,

                      fontFamily: 'GeneralSans-Medium',
                    }}>
                    {details?.username}
                  </CustomText>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  paddingHorizontal: 16,
                  //   marginTop: 50
                  alignItems: 'flex-start',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginVertical: 5,
                  }}>
                  <CustomText
                    style={{
                      fontSize: 18,

                      fontFamily: 'GeneralSans-SemiBold',
                    }}>
                    {details?.name}
                  </CustomText>

                  {/* <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      padding: 10,
                      borderRadius: 15,
                      paddingVertical: 7,
                      backgroundColor: '#0267B3',
                      paddingHorizontal: 12,
                      borderRadius: 20,
                    }}>
                    <CustomText
                      style={{
                        fontSize: 14,

                        fontFamily: 'GeneralSans-Medium',
                      }}>
                      {details?.mood
                        ? details.mood.charAt(0).toUpperCase() +
                 
                          details.mood.slice(1)
                        : 'Your mood'}
                    </CustomText>
                  </TouchableOpacity> */}

                  <CustomText
                    style={{
                      fontSize: 18,
                      marginLeft: 5,

                      fontFamily: 'GeneralSans-Regular',
                    }}>
                    {details?.active && 'is'}
                  </CustomText>

                  <CustomText
                    style={{
                      fontSize: 18,
                      marginLeft: 5,

                      fontFamily: 'GeneralSans-Medium',
                      color: details?.active
                        ? '#00A67E'
                        : colors.secondaryColor,
                      // marginRight:20
                    }}>
                    {details?.active ? 'online' : ''}
                  </CustomText>
                </View>
                {/* User Bio */}

                <CustomText
                  style={{
                    fontSize: 14,
                    marginTop: 5,

                    fontFamily: 'GeneralSans-Regular',
                    width: '70%',
                  }}>
                  {details?.bio || 'Add my biography'}
                </CustomText>

                {details?.goal && (
                  <CustomText
                    style={{
                      fontSize: 14,
                      marginTop: 5,

                      fontFamily: 'GeneralSans-Regular',
                    }}>
                    <CustomText
                      style={{
                        fontSize: 14,
                        marginTop: 5,

                        fontFamily: 'GeneralSans-SemiBold',
                      }}>
                      {details?.name}'s Goal:
                    </CustomText>{' '}
                    {details.goal}
                  </CustomText>
                )}

                {/* Mood Indicator */}
              </View>
            </View>

            {/* Friends,hearts */}
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'space-between',
                marginVertical: 40,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Friends', {id: id})}
                style={{
                  width: '48%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.disabledColor,
                  borderRadius: 10,
                  paddingVertical: 15,
                  paddingHorizontal: 14,
                }}>
                <Icon
                  name="people-circle"
                  size={20}
                  style={{marginRight: 10}}
                  color="#707070"
                />
                <CustomText
                  style={{
                    fontSize: 14,

                    fontFamily: 'GeneralSans-SemiBold',
                  }}>
                  {details?.friends?.length} friends
                </CustomText>
              </TouchableOpacity>
              {!isFriend ? (
                <>
                  {userExists ? (
                    <TouchableOpacity
                      onPress={() => acceptRequest()}
                      style={{
                        width: '48%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.mainColor,
                        borderRadius: 10,
                        paddingVertical: 15,
                        paddingHorizontal: 14,
                      }}>
                      <CustomText
                        style={{
                          fontSize: 14,
                          color: '#000',
                          fontFamily: 'GeneralSans-SemiBold',
                        }}>
                        Accept Request
                      </CustomText>
                    </TouchableOpacity>
                  ) : (
                    <>
                      {hasPendingRequest ? (
                        <TouchableOpacity
                          style={{
                            width: '48%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.disabledColor,
                            borderRadius: 10,
                            paddingVertical: 15,
                            paddingHorizontal: 14,
                          }}>
                          <CustomText
                            style={{
                              fontSize: 14,

                              fontFamily: 'GeneralSans-SemiBold',
                            }}>
                            Requested
                          </CustomText>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          disabled={loadingrequest}
                          onPress={() => sendReuest()}
                          style={{
                            width: '48%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.mainColor,
                            borderRadius: 10,
                            paddingVertical: 15,
                            paddingHorizontal: 14,
                          }}>
                          {loadingrequest ? (
                            <ActivityIndicator size={10} color={'#000'} />
                          ) : (
                            <CustomText
                              style={{
                                fontSize: 14,
                                color: '#000',
                                fontFamily: 'GeneralSans-SemiBold',
                              }}>
                              + Add friend
                            </CustomText>
                          )}
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleMessagePress}
                  style={{
                    width: '48%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.disabledColor,
                    borderRadius: 10,
                    paddingVertical: 15,
                    paddingHorizontal: 14,
                  }}>
                  <CustomText
                    style={{
                      fontSize: 14,

                      fontFamily: 'GeneralSans-SemiBold',
                    }}>
                    Message
                  </CustomText>
                </TouchableOpacity>
              )}

              {/* <TouchableOpacity
                  style={{
                    width: '48%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#101010',
                    borderRadius: 10,
                    paddingVertical: 15,
                    paddingHorizontal: 14,
                  }}>
                  <Icon
                    name="heart"
                    size={20}
                    style={{marginRight: 10}}
                    color="#707070"
                  />
                  <CustomText
                    style={{
                      fontSize: 14,

                      fontFamily: 'GeneralSans-SemiBold',
                    }}>
                    57 hearts
                  </CustomText>
                </TouchableOpacity> */}
            </View>

            <View
              style={{
                width: '100%',
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}>
              <CustomText
                style={{
                  fontSize: 16,

                  fontFamily: 'GeneralSans-SemiBold',
                }}>
                {_post?.length} posts
              </CustomText>
            </View>

            {_post?.length == 0 ? (
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  height: 500,
                  alignItems: 'center',
                }}>
                <CustomText
                  style={{
                    fontSize: 16,

                    fontFamily: 'GeneralSans-Regular',
                    marginTop: 50,
                  }}>
                  This user haven't posted yet
                </CustomText>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  backgroundColor: colors.appColor,
                  paddingVertical: 10,
                  alignItems: 'center',
                  paddingBottom: 50,
                  minHeight: 500,
                }}>
                {_post?.map(post => (
                  <View style={{marginBottom: 20}}>
                    <PostCard key={post._id} post={post} />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default UserProfile;
