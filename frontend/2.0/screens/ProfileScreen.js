import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import ChangeBio from '../../components/ChangeBioModal';
import ChangeProfilePic from '../../components/ChangeProfilePic';
import MoodModal from '../../components/MoodModal';
import CustomText from '../../components/CustomText';
import {logout} from '../../redux/UserSlice';
import {getColorsForTheme, server} from '../strings';
import PostCard from '../components/PostCard';
import ChangeGoalModal from '../../components/ChangeGoalModal';
import ChangeName from '../../components/ChangeNameModal';

const ProfileScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true); // Loading state
  const [refreshing, setRefreshing] = useState(false); // Refresh state for pull-to-refresh
  const [details, setDetails] = useState(null); // User details state
  const [bioModal, setBioModal] = useState(false); // Bio modal visibility state
  const [profilePicModal, setProfilePicModal] = useState(false); // Profile picture modal visibility state
  const [moodModal, setMoodModal] = useState(false); // Mood modal visibility state
  const [goalModal, setgoalModal] = useState(false); // Mood modal visibility state
  const [nameModal, setnameModal] = useState(false); // Mood modal visibility state
  const [_post, set_post] = useState([]);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  const userInfo = useSelector(state => state.userInfo); // Redux selector to get user information
  const dispatch = useDispatch(); // Redux dispatch function

  // Fetch user data from the server
  const getUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}api/user/${userInfo._id}`, {
        headers: {'Content-Type': 'application/json'},
      });
      setDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      setLoading(false);
    }
  };

  const getRandomPost = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${server}api/posts/user/${userInfo._id}`,
      );
      console.log(response.data);

      setLoading(false);
      set_post(response.data.post);
    } catch (error) {
      Alert.alert(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRandomPost();
    getUser(); // Fetch user data on component mount
  }, []);

  console.log(userInfo._id);

  return (
    <>
      {loading || refreshing ? (
        // Loading Indicator
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
        // Main Profile Screen Content
        <View style={{flex: 1, backgroundColor: colors.appColor}}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  getRandomPost();
                  getUser();
                }}
              />
            }
            contentContainerStyle={{paddingBottom: 200}}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}>
            {/* Logout button */}

            {/* User Info Section */}
            <View style={{width: '100%', paddingTop: 70}}>
              <TouchableOpacity
                onPress={() => setProfilePicModal(true)}
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
                  justifyContent: 'flex-end',
                  marginVertical: 10,
                  position: 'absolute',
                  top: 40,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Settings')}
                  style={{}}>
                  <Icon
                    name="settings-outline"
                    size={20}
                    style={{marginLeft: 2, marginRight: 15}}
                    color={colors.mainTextColor}
                  />
                </TouchableOpacity>
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
                  <TouchableOpacity
                    onPress={() => setnameModal(true)}
                    activeOpacity={0.8}
                    style={{}}>
                    <CustomText
                      style={{
                        fontSize: 18,

                        fontFamily: 'GeneralSans-Meidum',
                      }}>
                      {details?.name}
                    </CustomText>
                  </TouchableOpacity>
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
                </View>
                {/* User Bio */}
                <TouchableOpacity
                  onPress={() => setBioModal(true)}
                  activeOpacity={0.8}
                  style={{}}>
                  <CustomText
                    style={{
                      fontSize: 14,
                      marginTop: 5,

                      fontFamily: 'GeneralSans-Regular',
                      width: '70%',
                    }}>
                    {details?.bio || 'Add my biography'}
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setgoalModal(true)}
                  activeOpacity={0.8}
                  style={{}}>
                  {details?.goal ? (
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
                      </CustomText>
                      {"  " + details.goal}
                    </CustomText>
                  ) : (
                    <CustomText
                      style={{
                        fontSize: 14,
                        marginTop: 5,

                        fontFamily: 'GeneralSans-SemiBold',
                      }}>
                      Add your goals
                    </CustomText>
                  )}
                </TouchableOpacity>
                {/* Mood Indicator */}
              </View>
            </View>

            {/* Additional Profile Sections */}
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
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('Friends', {
                    id: userInfo._id,
                    myfriends: true,
                  })
                }
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.disabledColor,
                  borderRadius: 10,
                  paddingVertical: 13,
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
            </View>

            {/* Posts Section */}
            <View
              style={{
                width: '100%',
                backgroundColor: colors.appColor,
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

            {/* Placeholder for No Posts */}
            {_post?.length == 0 ? (
              <View
                style={{
                  width: '100%',
                  backgroundColor: colors.appColor,
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
                  You haven't posted yet
                </CustomText>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  backgroundColor: colors.appColor,
                  paddingVertical: 10,
                  alignItems: 'center',
                  minHeight: 500,
                  paddingBottom: 50,
                }}>
                {_post?.map(post => (
                  <View key={post._id} style={{marginBottom: 20}}>
                    <PostCard key={post._id} post={post} />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Modals */}
          <ChangeBio getUser={getUser} show={bioModal} setShow={setBioModal} />
          <ChangeProfilePic
            getUser={getUser}
            show={profilePicModal}
            setShow={setProfilePicModal}
          />
          <MoodModal
            getUser={getUser}
            show={moodModal}
            setShow={setMoodModal}
          />
          <ChangeGoalModal
            getUser={getUser}
            show={goalModal}
            setShow={setgoalModal}
          />
          <ChangeName
            userInfo={details}
            getUser={getUser}
            show={nameModal}
            setShow={setnameModal}
          />
        </View>
      )}
    </>
  );
};

export default memo(ProfileScreen);
