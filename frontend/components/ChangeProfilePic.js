import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import {login} from '../redux/UserSlice';
import {getColorsForTheme, server} from '../2.0/strings';

const ChangeProfilePic = React.memo(({show, setShow, getUser}) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const userInfo = useSelector(state => state.userInfo);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  // const loginUser = async (email, idToken,name) => {
  //   try {
  //     setLoading(true);
  //     const config = {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     };
  //     const response = await axios.post(
  //       `http://192.168.31.118:5000/api/user/`,
  //       {
  //         email,
  //         password: "",
  //         name:name,
  //       },
  //     );
  //     const {data} = response;
  //     setLoading(false);
  //     dispatch(login(data));
  //     navigation.navigate('BottomTab');
  //   } catch (error) {
  //     console.error('Error logging in:', error.message);
  //     Alert.alert(error.message, 'Please Recheck you Email And Password');
  //     setLoading(false);
  //   }
  // };

  const dispatch = useDispatch();

  const changeProfilePic = useCallback(
    async url => {
      try {
        setLoading(true);
        const response = await axios.put(
          `${server}api/user/profilePic/${userInfo._id}/`,
          {profilePic: url},
          {headers: {'Content-Type': 'application/json'}},
        );
  
        ToastAndroid.show('ProfilePic updated', ToastAndroid.SHORT);
        console.log('12345' + response.data);
        getUser();
        dispatch(
          login({
            _id: userInfo._id,
          name: response.data.name,
          username: response.data.username,
          goal: response.data.goal,
          goalCategory: response.data.goalCategory,
          email: response.data.email,
          profilePic: response.data.profilePic,
          }),
        );
        setShow(false);
      } catch (error) {
        console.error('Error updating profile picture:', error.message);
        Alert.alert('Error', 'Failed to update profile picture.');
      } finally {
        setLoading(false);
      }
    },
    [getUser, setShow, userInfo._id],
  );

  // console.log(userInfo);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      cropping: true,
      cropperCircleOverlay: true, // Optionally, use a circle overlay
      cropperAspectRatio: 1,
      cropperShowGrid: false, // Show a grid if you want
    })
      .then(image => {
        setResult(image);
      })
      .catch(error => {
        console.log('Image Picker Error:', error);
      });
  };

  const uploadImage = async () => {
    const filename = result.path.substring(result.path.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? result.path.replace('file://', '') : result.path;
    setUploading(true);
    try {
      const task = storage().ref(filename).putFile(uploadUri);
      await task;
      const url = await storage().ref(filename).getDownloadURL();
      changeProfilePic(url);
    } catch (e) {
      Alert.alert('Upload Error', 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);

  const bottomValue = React.useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(bottomValue, {
      toValue: show ? 10 : 450,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (!show) setShow(false);
    });
  }, [show, bottomValue, setShow]);

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={show}
      onRequestClose={() => {
        Animated.timing(bottomValue, {
          toValue: 450,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShow(false));
      }}
      animationType="none">
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000AA',
          height: '100%',
        }}>
        <TouchableOpacity
          onPress={() => {
            Animated.timing(bottomValue, {
              toValue: 450,
              duration: 200,
              useNativeDriver: true,
            }).start(() => setShow(false));
          }}
          activeOpacity={0.7}
          style={{height: '40%'}}
        />
        <Animated.View
          style={{
            backgroundColor: colors.appColor,
            width: '100%',
            flexDirection: 'column',
            height: '60%',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            justifyContent: 'space-between',
            transform: [{translateY: bottomValue}],
          }}>
          <View
            style={{
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: colors.appColor,
                padding: 20,
                borderRadius: 20,
                height: '100%',
              }}>
              {loading || uploading ? (
                <ActivityIndicator
                  style={{borderRadius: 100}}
                  size={40}
                  color={colors.mainColor}
                />
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
                      Please Select a Profile Pic
                    </CustomText>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleImagePicker}>
                    <Image
                      source={{
                        uri: result
                          ? result.path
                          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png?20220519031949',
                      }}
                      resizeMode={result ? 'cover' : 'stretch'}
                      style={{
                        width: result ? '65%' : '100%',
                        backgroundColor: '#404040',
                        height: result ? 210 : 250,
                        borderRadius: result ? 100 : 30,
                        marginVertical: 5,
                        marginTop: 30,
                        marginBottom: 20,
                        alignSelf: 'center',
                      }}
                    />
                    {result && (
                      <TouchableOpacity
                        onPress={() => setResult(null)}
                        style={{
                          alignItems: 'flex-end',
                          position: 'absolute',
                          top: 30,
                          right: 15,
                        }}>
                        <Icon
                          name="close-outline"
                          size={30}
                          color={colors.mainTextColor}
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>

                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between',
                    }}>
                    {!result ? (
                      <View
                        style={{
                          width: '100%',
                          paddingVertical: 14,
                          backgroundColor: colors.disabledColor,
                          borderRadius: 6,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <CustomText
                          bold
                          style={{fontSize: 16, color: '#a6a6a6'}}>
                          Change Profile Pic
                        </CustomText>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={uploadImage}
                        activeOpacity={0.9}
                        style={{
                          width: '100%',
                          paddingVertical: 14,
                          backgroundColor: colors.mainColor,
                          borderRadius: 6,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <CustomText bold style={{fontSize: 16, color: '#000'}}>
                          Change Profile Pic
                        </CustomText>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

export default ChangeProfilePic;
