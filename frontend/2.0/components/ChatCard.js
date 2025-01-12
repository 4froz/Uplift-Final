import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import BlastedImage from 'react-native-blasted-image';
import {useSelector} from 'react-redux';
import CustomText from '../../components/CustomText';
import {getColorsForTheme} from '../strings';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatCard = ({item, setReply}) => {
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);

  const userInfo = useSelector(state => state.userInfo);

  return (
    <TouchableOpacity
      onLongPress={() => {
        console.log('Chat held! Performing action...');
        setReply(item.message);
      }}
      delayLongPress={300} // Optional: Delay before the long press is registered
      activeOpacity={0.8} // Optional: Visual feedback on press
    >
      <View
        key={item.message}
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent:
            userInfo._id === item.user._id ? 'flex-end' : 'flex-start',
          width: '100%',
          alignItems: 'center',
        }}>
        {userInfo._id !== item.user._id && (
          <BlastedImage
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              marginRight: 10,
              elevation: 0,
              backgroundColor: colors.appColor,
            }}
            source={{uri: item.user.profilePic}}
          />
        )}

        <View
          style={{
            alignItems:
              userInfo._id === item.user._id ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
          }}>
          {item.reply && (
            <View
              style={{
                alignItems:
                  userInfo._id === item.user._id ? 'flex-end' : 'flex-start',
              }}>
              <CustomText
                style={{
                  color: colors.secondaryColor,
                  fontSize: 14,
                  fontFamily: 'GeneralSans-Regular',
                  marginBottom: 5,
                }}>
                Replied
              </CustomText>
              <View
                style={{
                  backgroundColor: colors.disabledColor,
                  alignSelf: 'flex-start',
                  padding: 10,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginBottom: 5,
                }}>
                <CustomText
                  numberOfLines={1}
                  style={{
                    color: '#a6a6a6',
                    fontSize: 16,
                    fontFamily: 'GeneralSans-Regular',
                  }}>
                  {item.reply}
                </CustomText>
              </View>
            </View>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor:
                  userInfo._id === item.user._id
                    ? '#421CEF'
                    : colors.disabledColor,
                alignSelf: 'flex-end',
                padding: 10,
                borderRadius: 10,
                maxWidth: '100%',
                flexShrink: 1,
                alignItems: 'center',
              }}>
              <CustomText
                style={{
                  color:
                    userInfo._id === item.user._id
                      ? '#fff'
                      : colors.mainTextColor,
                  fontSize: 16,
                  fontFamily: 'GeneralSans-Regular',
                }}>
                {item.message}
              </CustomText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;
