import {View, Image, TouchableOpacity, Animated} from 'react-native';
import React, {memo, useEffect, useState, useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import moment from 'moment';
import {server, getColorsForTheme} from '../strings';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axios from 'axios';

const PostCard = ({post}) => {
  const navigation = useNavigation();
  const [likedPost, setLikedPost] = useState(false);
  const [like, setLikes] = useState(0);
  const [reaction, setReaction] = useState([]);
  const userInfo = useSelector(state => state.userInfo);
  const isLiked = post?.likes.find(x => x.like == userInfo?._id);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const themeMode = useSelector(state => state.theme.themeMode);
  const colors = getColorsForTheme(themeMode);

  useEffect(() => {
    setLikes(post?.likes?.length);
    setReaction(post?.reactions);
    if (isLiked != null) {
      setLikedPost(true);
    } else {
      setLikedPost(false);
    }
  }, []);

  const submitHandler = async () => {
    setLikedPost(!likedPost);
    likedPost ? setLikes(like - 1) : setLikes(like + 1);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const response = await axios.put(`${server}api/posts/${post._id}/like`, {
        like: userInfo._id,
        user: userInfo,
      });
      console.log('niggernigger' + response.data);
    } catch (error) {
      console.log(error);
    }
  };

  function getCustomTimeFormat(date) {
    const now = moment();
    const duration = moment.duration(now.diff(moment(date)));

    const seconds = Math.floor(duration.asSeconds());
    const minutes = Math.floor(duration.asMinutes());
    const hours = Math.floor(duration.asHours());
    const days = Math.floor(duration.asDays());

    if (seconds < 60) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }

  return (
    <View
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PostScreen', {id: post._id})}
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
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          userInfo._id !== post.userId &&
          navigation.navigate('UserProfile', {id: post.userId})
        }>
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
      </TouchableOpacity>
      <View style={{width: '85%'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              userInfo.name !== post.name &&
              navigation.navigate('UserProfile', {id: post.userId})
            }>
            <CustomText
              style={{fontSize: 16, fontFamily: 'GeneralSans-Medium'}}>
              {post.name} {post.mood && `is ${post.mood}`}
            </CustomText>
          </TouchableOpacity>
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
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('PostScreen', {id: post._id})}>
          <CustomText
            style={{
              fontSize: 16,
              marginTop: 5,
              fontFamily: 'GeneralSans-Regular',width:"100%"
            }}>
            {post.desc}
          </CustomText>
        </TouchableOpacity>
        {post.image && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PostScreen', {id: post._id})}>
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
          </TouchableOpacity>
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
            <TouchableOpacity activeOpacity={0.9} onPress={submitHandler}>
              <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                <Icon
                  name={likedPost ? 'heart' : 'heart-outline'}
                  color={likedPost ? '#FF499E' : '#a6a6a6'}
                  size={18}
                />
              </Animated.View>
            </TouchableOpacity>
            {like !== 0 && (
              <CustomText
              semibold
                style={{
                  marginLeft: 3,
                  fontSize: 16,
                  color: colors.secondaryColor,
                  
                  transform: [{translateY: -1}],
                }}>
                {like}
              </CustomText>
            )}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('PostScreen', {id: post._id})}>
              <Icon name="chatbubbles-outline" color="#a1a1a1" size={18} />
            </TouchableOpacity>
            {reaction?.length !== 0 && (
              <CustomText
              semibold
                style={{
                  marginLeft: 3,
                  fontSize: 16,
                  color: colors.secondaryColor,
                  
                  transform: [{translateY: -1}],
                }}>
                {post?.reactions?.length}
              </CustomText>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(PostCard);
