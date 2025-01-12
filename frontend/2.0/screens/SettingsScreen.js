import {View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import CustomText from '../../components/CustomText';
import {getColorsForTheme, server} from '../strings';
import {toggleTheme} from '../../redux/themeSlice';
import {logout} from '../../redux/UserSlice';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

const SettingsScreen = ({navigation}) => {
  const themeMode = useSelector(state => state.theme.themeMode);
  const userInfo = useSelector(state => state.userInfo);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  const [theme, setTheme] = useState('light');
  const dispatch = useDispatch();

  const unsubscribeToUserTopic = async () => {
    await messaging().unsubscribeFromTopic(`user_${userInfo._id}`);
    console.log(`Subscribed to topic: user_${userInfo._id}`);
  };

  const updateStatus = async isActive => {
    try {
      await axios.put(`${server}api/user/activeStatus/${userInfo._id}/`, {
        active: isActive,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.appColor,
        paddingTop: 40,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 100, alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            paddingBottom: 10,
            borderColor: colors.disabledColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('BottomTab', {screen: 'Home'})}
              activeOpacity={0.7}>
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
              Settings
            </CustomText>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => dispatch(toggleTheme())}
          style={{
            backgroundColor: colors.disabledColor,
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            paddingVertical: 15,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.secondaryColor,
            justifyContent: 'space-between',
          }}>
          <CustomText
            style={{
              fontSize: 16,
              fontFamily: 'GeneralSans-Medium',
            }}>
            Theme
          </CustomText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CustomText
                style={{
                  fontSize: 16,
                  fontFamily: 'GeneralSans-Regular',
                }}>
                Dark
              </CustomText>

              {themeMode === 'dark' ? (
                <View
                  style={{
                    padding: 5,
                    borderRadius: 30,
                    backgroundColor: '#5CD4A2',
                    alignItems: 'center',
                    marginLeft: 10,
                    borderWidth: 1.5,
                    borderColor: colors.mainTextColor,
                  }}
                />
              ) : (
                <View
                  style={{
                    padding: 5,
                    borderRadius: 30,
                    backgroundColor: '#A6A6A6',
                    alignItems: 'center',
                    marginLeft: 10,
                    borderWidth: 1.5,
                    borderColor: colors.mainTextColor,
                  }}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={() => dispatch(toggleTheme())}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <CustomText
                style={{
                  fontSize: 16,
                  fontFamily: 'GeneralSans-Regular',
                }}>
                Light
              </CustomText>

              {themeMode === 'light' ? (
                <View
                  style={{
                    padding: 5,
                    borderRadius: 30,
                    backgroundColor: '#5CD4A2',
                    alignItems: 'center',
                    marginLeft: 10,
                    borderWidth: 1.5,
                    borderColor: colors.mainTextColor,
                  }}
                />
              ) : (
                <View
                  style={{
                    padding: 5,
                    borderRadius: 30,
                    backgroundColor: '#A6A6A6',
                    alignItems: 'center',
                    marginLeft: 10,
                    borderWidth: 1.5,
                    borderColor: colors.mainTextColor,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            updateStatus(false);
            unsubscribeToUserTopic();
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          }}
          style={{
            backgroundColor: colors.disabledColor,
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            paddingVertical: 15,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <CustomText
            style={{
              fontSize: 16,
              fontFamily: 'GeneralSans-Medium',
            }}>
            Logout
          </CustomText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
