import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {useSelector} from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import CustomText from '../../components/CustomText';
import ReactionCard from '../components/ReCard';
import {getColorsForTheme, server} from '../strings';
import PostComment from '../../components/PostComment';

const PostScreen = ({navigation, route}) => {
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  const userInfo = useSelector(state => state.userInfo);
  const [loading, setLoading] = useState(true);
  const [loadingrequest, setLoadingRequest] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState({});
  const [_reaction, set_Reaction] = useState('');
  const [reaction, setreaction] = useState([]);
  const [like, setlikes] = useState(0);
  const isLiked = post?.likes?.find(x => x._like == userInfo?._id);
  const [likedPost, setLikedPost] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current; // Animated value for scaling

  const {id} = route.params;

  const getPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}api/posts/${id}`);
      setPost(response?.data);
      setlikes(response?.data?.likes?.length);
      setreaction(response?.data?.reactions);
      if (response?.data.likes?.find(x => x.like == userInfo?._id)) {
        setLikedPost(true);
      } else {
        setLikedPost(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post details:', error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getPost();
  }, [id]);

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
  const submitHandler = async () => {
    setLikedPost(!likedPost),
      likedPost ? setlikes(like - 1) : setlikes(like + 1);

    try {
      const {data} = await axios.put(`${server}api/posts/${post._id}/like`, {
        like: userInfo._id,
        user: userInfo,
      });
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderItem = post => (
    <View
      activeOpacity={0.9}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingVertical: 20,
        borderColor: colors.disabledColor,
        paddingHorizontal: 16,
      }}>
      <Image
        style={{
          width: 40,
          height: 40,
          borderRadius: 50,
          borderColor: '#fff',
          backgroundColor: '#404040',
        }}
        source={{
          uri:
            post?.profilePic ||
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
        }}
      />
      <View style={{width: '85%'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
          }}>
          <CustomText style={{fontSize: 16, fontFamily: 'GeneralSans-Medium'}}>
            {post.name} {post.mood && `is ${post.mood}`}
          </CustomText>
          <CustomText
            style={{
              fontSize: 16,
              marginLeft: 10,
              color: colors.secondaryColor,
              fontFamily: 'GeneralSans-Regular',
            }}>
            {getCustomTimeFormat(post.createdAt)}
          </CustomText>
        </View>
        <CustomText
          style={{
            fontSize: 16,
            marginTop: 5,
            fontFamily: 'GeneralSans-Regular',
          }}>
          {post.desc}
        </CustomText>
        {post.image && (
          <Image
            source={{uri: post.image}}
            style={{
              width: '100%',
              marginTop: 10,
              backgroundColor: colors.disabledColor,
              borderRadius: 10,
              height: 400,
            }}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}>
            <TouchableOpacity onPress={submitHandler}>
              <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                <Icon
                  name={likedPost ? 'heart' : 'heart-outline'}
                  color={likedPost ? '#C71E1E' : '#a6a6a6'}
                  size={16}
                />
              </Animated.View>
            </TouchableOpacity>
            {like !== 0 && (
              <CustomText
                style={{
                  marginLeft: 3,
                  fontSize: 14,
                  color: '#a6a6a6',
                  fontFamily: 'GeneralSans-Regular',
                  transform: [{translateY: -1}],
                }}>
                {like}
              </CustomText>
            )}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PostScreen', {id: post._id})}>
              <Icon name="chatbubbles-outline" color="#a1a1a1" size={16} />
            </TouchableOpacity>
            {reaction?.length !== 0 && (
              <CustomText
                style={{
                  marginLeft: 3,
                  fontSize: 14,
                  color: '#a6a6a6',
                  fontFamily: 'GeneralSans-Regular',
                  transform: [{translateY: -1}],
                }}>
                {reaction?.length}
              </CustomText>
            )}
          </View>
        </View>
      </View>
    </View>
  );

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
        <View
          style={{flex: 1, backgroundColor: colors.appColor, paddingTop: 40}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            contentContainerStyle={{paddingBottom: 100}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  getPost();
                }}
              />
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
                borderBottomWidth: 1.5,
                paddingBottom: 15,
                borderColor: colors.disabledColor,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('BottomTab', {screen: 'Home'})
                  }
                  activeOpacity={0.7}>
                  <Icon
                    name="arrow-back"
                    size={20}
                    style={{marginLeft: 2, marginRight: 15}}
                    color={colors.mainTextColor}
                  />
                </TouchableOpacity>
                <CustomText
                  style={{fontSize: 18, fontFamily: 'GeneralSans-Medium'}}>
                  Post
                </CustomText>
              </View>
            </View>
            {renderItem(post)}
            <CustomText
              style={{
                fontSize: 18,
                fontFamily: 'GeneralSans-SemiBold',
                padding: 20,
                marginTop: 10,
              }}>
              {reaction?.length} Reactions
            </CustomText>

            {reaction.map((r,i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'column',
                  width: '100%',
                  padding: 20,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.disabledColor,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('UserProfile', {
                        id: r?.user._id,
                      })
                    }>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: '#fff',
                        backgroundColor: '#404040',
                      }}
                      source={{
                        uri:
                          r?.user?.profilePic ||
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
                      }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '84%',
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('UserProfile', {
                        id: r?.user._id,
                      })
                    } style={{flexDirection: 'row', alignItems: 'center'}}>
                      <CustomText
                        style={{
                          fontSize: 13,
                          fontFamily: 'GeneralSans-SemiBold',
                        }}>
                        {r?.user?.name}
                      </CustomText>
                    </TouchableOpacity>
                    <CustomText
                      style={{
                        fontSize: 13,
                        fontFamily: 'GeneralSans-Medium',
                        marginVertical: 5,
                      }}>
                      {r?.reaction}
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
                          fontFamily: 'GeneralSans-Regular',
                        }}>
                        {getCustomTimeFormat(r?.createdAt)}
                      </CustomText>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <PostComment setReactions={setreaction} id={id} />
        </View>
      )}
    </>
  );
};

export default PostScreen;
