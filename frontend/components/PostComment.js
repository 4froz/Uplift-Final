import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '../components/CustomText';
import {useSelector} from 'react-redux';
import axios from 'axios';
import { getColorsForTheme,  server } from '../2.0/strings';

const PostComment = ({id, setReactions}) => {
  const [message, setmessage] = useState('');
  const userInfo = useSelector(state => state.userInfo);
  const inputRef = useRef(null);

  const user = {
    name: userInfo.name,
    profilePic:
      userInfo.profilePic ||
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
    _id: userInfo._id,
  };

  console.log(inputRef);

  const mainReaction = {
    reaction: message,
    createdAt: Date.now(),
    user: userInfo,
  };

  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);

  const addcomment = async () => {
    try {
        setReactions(prevChats => [...prevChats, {reaction:message, user}]);
      setmessage('');
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.put(
        `${server}api/posts/${id}/react`,
        {
          reaction:mainReaction,
        },
      );
      const {data} = response;
    } catch (error) {
      ToastAndroid.show(error.message, 500);
    }
  };
  const handleSubmit = () => {
    if (message.trim()) {
      addcomment();
      setmessage(''); // Clear the text input
      // Keep the keyboard open
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  return (
    <View
      style={{
        backgroundColor: colors.appColor,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        elevation:5,paddingTop:20
      }}>
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
          paddingVertical: 7,
          backgroundColor: colors.disabledColor,
          marginBottom: 20,
          paddingLeft: 10,
        }}>
        {/* <Image
          style={{
            width: '10.2%',
            height: 36,
            borderRadius: 100,
            backgroundColor:"#404040"
          }}
          source={{
            uri: 'https://yt3.ggpht.com/XDA6ig1JeTk6W84g4ipe4LhkWsghnDjq1Zuod27XxRrLkthoLBC3gj_zxQcop1kSBzw3BKIj=s68-c-k-c0x00ffffff-no-rj',
          }}
        /> */}
        <View style={{flexDirection: 'column', width: '100%'}}>
          <KeyboardAvoidingView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width:"80%"
            }}
            keyboardVerticalOffset={100}
            behavior="padding">
            {/* <CustomText bold style={{fontSize: 15}}>
              4frozzzz
            </CustomText> */}
            <TextInput
              ref={inputRef}
              onSubmitEditing={e => {
                handleSubmit;
              }}
              value={message}
              maxLength={200}
              multiline
              onChangeText={e => setmessage(e)}
              style={{
                width: '100%',
                fontFamily: 'GeneralSans-Medium',
                paddingVertical: 5,
                fontSize: 15,
                color:colors.mainTextColor,
              }}
              placeholderTextColor={colors.secondaryColor}
              placeholder="Add your reaction"
            />

            {message.length > 0 && (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'center',
                  width:100
                }}
                onPress={() => addcomment()}>
                <Icon
                  style={{marginRight: 20}}
                  size={20}
                  color={colors.mainColor}
                  name="paper-plane"
                />
              </TouchableOpacity>
            )}
          </KeyboardAvoidingView>
        </View>

        {/* <TouchableOpacity style={{width:"15%",alignItems:'flex-end'}}>
    <CustomText bold style={{fontSize: 15}}>
      POST
    </CustomText>
  </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default PostComment;
