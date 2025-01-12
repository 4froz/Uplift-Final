import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '../components/CustomText';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axios from 'axios';

const PostCard = ({post}) => {
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
  const colors = [
    '#7B007B',
    '#B829E6',
    '#4A17E0',
    '#BF4BA2',
    '#21C95A',
    '#BA1C3C',
    '#F70000',
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const [likedPost, setLikedPost] = useState(false);
  const [like, setlikes] = useState(0);
  const [reaction, setreaction] = useState([]);
  const navigation = useNavigation();
  const userInfo = useSelector(state => state.userInfo); // Redux selector to get user information
  const isLiked = post?.likes.find(x => x.like == userInfo?._id);
  useEffect(() => {
    setlikes(post.likes.length);
    setreaction(post.comments);
    if (isLiked != null) {
      setLikedPost(true);
    } else {
      setLikedPost(false);
    }
  }, []);
  const submitHandler = async () => {
    setLikedPost(!likedPost),
      likedPost ? setlikes(like - 1) : setlikes(like + 1);

    try {
      const {data} = await axios.put(
        `https://68de-2409-40c2-4001-748c-dd98-9a25-23a2-ed68.ngrok-free.app/api/posts/${post._id}/like`,
        {
          like: userInfo._id,
        },
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View
      key={post._id}
      style={{
        flexDirection: 'column',
        width: '95%',
        padding: 20,
        // marginTop:20,
        // borderLeftWidth: 3,
        // borderLeftColor: randomColor,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#202020',
        backgroundColor:"#202020",
        borderRadius:20,
        // elevation:5,
        shadowColor: '#000',
        alignSelf:'center'
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', {id: post.userId})}>
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: '#fff',
              backgroundColor: '#404040',
            }}
            source={{
              uri:
                post?.profilePic ? post.profilePic :
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'column',
            width: '84%',
            // height: '90%',
            alignSelf: 'center',
            // backgroundColor:"red",
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText
              style={{
                color: '#fff',
                fontSize: 13,
                fontFamily: 'GeneralSans-SemiBold',
              }}>
              {post?.name}
            </CustomText>
            <CustomText
              style={{
                color: '#fff',
                fontSize: 13,
                fontFamily: 'GeneralSans-Regular',
                marginHorizontal: 5,
              }}>
              is
            </CustomText>
            <CustomText
              style={{
                fontSize: 12,
                backgroundColor: '#BB2B00',
                padding: 10,
                paddingVertical: 5,
                color: '#fff',
                fontFamily: 'GeneralSans-Regular',
                borderRadius: 10,
              }}>
              {post?.mood?.charAt(0).toUpperCase() + post?.mood?.slice(1)}
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: '',
              alignItems: 'center',
            }}>
            <CustomText
              numberOfLines={1}
              style={{
                color: '#a6a6a6',
                fontSize: 12,
                fontFamily: 'GeneralSans-Regular',
              }}>
              {getCustomTimeFormat(post.createdAt)}
            </CustomText>
            <CustomText
              numberOfLines={1}
              style={{
                color: '#a1a1a1',
                fontSize: 12,
                fontFamily: 'GeneralSans-Regular',
                transform: [{translateY: -3}],
                marginHorizontal: 5,
              }}>
              .
            </CustomText>
            <Icon name="globe-outline" color="#a1a1a1" size={12} />
          </View>
        </View>
      </View>

      <CustomText
        style={{
          fontSize: 16,
          marginTop: 20,
          color: '#fff',
          fontFamily: 'GeneralSans-Medium',
        }}>
        {post?.desc} 😁
      </CustomText>

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
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Post',{id:post._id})}>
            <Icon name="chatbubbles-outline" color="#a1a1a1" size={16} />
          </TouchableOpacity>
          {reaction.length !== 0 && (
            <CustomText
              style={{
                marginLeft: 3,
                fontSize: 14,
                color: '#a6a6a6',
                fontFamily: 'GeneralSans-Regular',
                transform: [{translateY: -1}],
              }}>
              {post.comments.length}
            </CustomText>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 10,
          }}>
          <TouchableOpacity onPress={() => submitHandler()}>
            <Icon
              name={likedPost ? 'heart' : 'heart-outline'}
              color={likedPost ? '#C71E1E' : '#a6a6a6'}
              size={16}
            />
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
      </View>
    </View>
  );
};

export default memo(PostCard);
