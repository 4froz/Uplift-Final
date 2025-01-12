import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import React, { useRef, useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import CustomText from '../components/CustomText';
import { getColorsForTheme, server } from '../2.0/strings';
import axios from 'axios';

const Comment = ({ id, setCommunity, reply, setReply, messageUser, details }) => {
  const [message, setMessage] = useState('');
  const userInfo = useSelector(state => state.userInfo);
  const inputRef = useRef(null);
  const themeMode = useSelector(state => state.theme.themeMode);
  const colors = getColorsForTheme(themeMode);
  const [isSubmitting, setIsSubmitting] = useState(false);  // New flag to handle multiple submissions

  const user = {
    name: userInfo.name,
    profilePic:
      userInfo.profilePic ||
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
    _id: userInfo._id,
  };

  const addMessage = useCallback(async () => {
    if (isSubmitting) return;  // Prevent multiple submissions
    setIsSubmitting(true);  // Set submitting to true to prevent spam
    
    try {
      setCommunity(prevChats => [
        ...prevChats,
        { message, user, reply },
      ]);
      setMessage('');  // Clear message after adding to the community
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await axios.post(`${server}api/community/${id}`, {
        message,
        user,
        date: new Date().toISOString(),
        reply,
        from: userInfo._id,
        to: details._id,
      });
      setReply('');  // Clear reply after successful submission
      const { data } = response;
    } catch (error) {
      ToastAndroid.show(error.message, 500);
    } finally {
      setIsSubmitting(false);  // Allow submitting again
    }
  }, [message, user, reply, id, userInfo, details, setCommunity, setReply, isSubmitting]);

  const handleSubmit = useCallback(() => {
    if (message.trim()) {
      addMessage();
      if (inputRef.current) {
        inputRef.current.focus();  // Keep the keyboard open
      }
    }
  }, [addMessage, message]);

  return (
    <View style={{ backgroundColor: colors.appColor, position: 'absolute', bottom: 0, width: '100%',elevation:5,paddingTop:20 }}>
      {reply && (
        <View style={{ paddingHorizontal: 16, marginBottom: 10, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <CustomText style={{ color: colors.secondaryColor, fontSize: 14 }}>
              Replying to {messageUser.name}
            </CustomText>
            <TouchableOpacity onPress={() => setReply('')}>
              <Icon name="close-outline" size={20} color={colors.mainTextColor} />
            </TouchableOpacity>
          </View>
          <CustomText numberOfLines={1} style={{ fontSize: 14 }}>
            {reply}
          </CustomText>
        </View>
      )}
      
      <View style={{
        width: '95%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 5,
        backgroundColor: colors.disabledColor,
        marginBottom: 20,
        paddingLeft: 10,
      }}>
        <KeyboardAvoidingView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} behavior="padding">
          <TextInput
            ref={inputRef}
            value={message}
            maxLength={250}
            onChangeText={setMessage}
            multiline
            style={{
              width: '90%',
              fontFamily: 'GeneralSans-Medium',
              paddingVertical: 5,
              fontSize: 15,
              color: colors.mainTextColor,
            }}
            placeholder="Message..."
            placeholderTextColor={'#a6a6a6'}
            onSubmitEditing={handleSubmit}  // Properly bind submit handler
          />

          {message.length > 0 && !isSubmitting && (
            <TouchableOpacity
              style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}
              onPress={handleSubmit}  // Call handleSubmit instead of directly invoking addMessage
            >
              <Icon style={{ marginRight: 5 }} size={20} color={colors.mainColor} name="paper-plane" />
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Comment;
