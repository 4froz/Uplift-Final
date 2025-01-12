import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ToastAndroid,
    ActivityIndicator,
  } from 'react-native';
  import React, {useState} from 'react';
  import CustomText from './CustomText';
  import axios from 'axios';
  import {useSelector} from 'react-redux';
import { getColorsForTheme, server } from '../2.0/strings';
  
  const UnfriendModal = ({show, setShow, getUser,user}) => {
    const [bio, setbio] = useState('');
    const [loading, setLoading] = useState(false);
    const userInfo = useSelector(state => state.userInfo);
  
    const removeFriend = async () => {
        try {
          setLoading(true);
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          const response = await axios.post(
            `${server}api/user/friends/${userInfo._id}`,
            {friendId: user._id},
          );
          const {data} = response;
          getUser();
          setLoading(false);
        } catch (error) {
          console.error('Error logging in:', error.message);
          // alert(error);
          setLoading(false);
        }
      };
      const themeMode = useSelector(state => state.theme.themeMode);

      // Dynamically get the colors based on the current theme
      const colors = getColorsForTheme(themeMode);
    return (
      <Modal
        transparent
        statusBarTranslucent
        visible={show}
        onRequestClose={() => setShow(false)}
        animationType="fade">
        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000AA',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                backgroundColor: colors.appColor,
                padding: 20,
                paddingVertical: 25,
                borderRadius: 20,
              }}>
              {loading ? (
                     <View
                     style={{
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
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <CustomText
                      bold
                      style={{
                        fontSize: 18,
                        fontFamily: 'GeneralSans-SemiBold',
                      }}>
                      Unfriend {user.name}?
                    </CustomText>
                  </View>
  
                
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      marginTop: 40,
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => setShow(false)}
                      activeOpacity={0.9}
                      style={{
                        width: '45%',
                        paddingVertical: 14,
                        backgroundColor: colors.disabledColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 6,
                      }}>
                      <CustomText  style={{fontSize: 15, color: colors.secondaryColor}}>
                        Cancel
                      </CustomText>
                    </TouchableOpacity>
  
                 
                      <TouchableOpacity
                        onPress={() => removeFriend()}
                        activeOpacity={0.9}
                        style={{
                          width: '45%',
                          paddingVertical: 14,
                          backgroundColor: colors.mainColor,
                          borderRadius: 6,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <CustomText  style={{fontSize: 16, color: '#000'}}>
                          Confirm
                        </CustomText>
                      </TouchableOpacity>
                    
                  </View>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };
  
  export default UnfriendModal;
  