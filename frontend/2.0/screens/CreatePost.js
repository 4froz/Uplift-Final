import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import CustomText from '../../components/CustomText';
import {getColorsForTheme, server} from '../strings';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import AutoHeightImage from '../components/CustomImage';

const CreatePostScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const themeMode = useSelector(state => state.theme.themeMode);
  const colors = getColorsForTheme(themeMode);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const userInfo = useSelector(state => state.userInfo);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      cropping: true,
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
      setLoading(true);
      const response = await axios.post(`${server}api/posts/`, {
        desc: message,
        user: userInfo,
        image: url,
      });
      setLoading(false);
      navigation.navigate('BottomTab', {screen: 'Home'});
    } catch (e) {
      Alert.alert('Upload Error', 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('BottomTab', {screen: 'Home'});
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  const createPost = async () => {
    try {
      if (result) {
        uploadImage();
      } else {
        setLoading(true);
        const response = await axios.post(`${server}api/posts/`, {
          desc: message,
          user: userInfo,
        });
        setLoading(false);
        navigation.navigate('BottomTab', {screen: 'Home'});
      }
    } catch (error) {
      console.error('Error Posting:', error.message);
      Alert.alert(error.message, 'Error Posting');
      setLoading(false);
    }
  };

  return (
    <>
      {loading || uploading ? (
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
          style={{
            flex: 1,
            backgroundColor: colors.appColor,
            paddingHorizontal: 16,
            paddingTop: 40,
          }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
                borderBottomWidth: 0.5,
                paddingBottom: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('BottomTab', {screen: 'Home'})
                  }
                  activeOpacity={0.7}>
                  <Icon
                    name="close"
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
                  New Post
                </CustomText>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginTop: 20, justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 20, borderColor: 'rgba(243, 245, 247, 0.15)'}}>
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
                    userInfo?.profilePic ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
                }}
              />
              <View style={{width: '85%'}}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start', width: '100%'}}>
                  <CustomText style={{fontSize: 16, fontFamily: 'GeneralSans-Medium'}}>
                    {userInfo.name}
                  </CustomText>
                </View>
                <TextInput
                  value={message}
                  onChangeText={e => setMessage(e)}
                  maxLength={200}
                  placeholder="Write a post"
                  placeholderTextColor={colors.secondaryColor}
                  style={{
                    fontFamily: 'GeneralSans-Regular',
                    fontSize: 16,
                    paddingVertical: 7,
                    width: '92%',
                    color: colors.mainTextColor,
                  }}
                />
                {result && (
                  <>
                    <AutoHeightImage
                      style={{width: '100%', borderRadius: 10}}
                      source={{uri: result.path}}
                    />
                    <TouchableOpacity
                      onPress={() => setResult(null)}
                      style={{
                        alignItems: 'flex-end',
                        position: 'absolute',
                        top: 70,
                        right: 15,
                        backgroundColor: '#000',
                        padding: 5,
                        borderRadius: 50,
                      }}>
                      <Icon name="close-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </>
                )}
                <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 20}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                    <TouchableOpacity onPress={() => handleImagePicker()}>
                      <Icon name={'image-outline'} color={colors.mainTextColor} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => createPost(userInfo.email)}
            disabled={loading || message?.length < 5}
            style={{
              position: 'absolute',
              marginTop: 15,
              alignItems: 'center',
              backgroundColor: message?.length < 5 ? colors.disabledColor : colors.mainColor,
              padding: 20,
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              paddingVertical: 12,
              bottom: 20,
              alignSelf: 'center',
            }}>
            <CustomText
              style={{
                fontSize: 16,
                color: message?.length < 5 ? '#a6a6a6' : '#000',
                fontFamily: 'GeneralSans-SemiBold',
              }}>
              Post Now
            </CustomText>
            <Icon1
              name="reply"
              size={20}
              style={{
                marginLeft: 10,
                transform: [{scaleX: -1}],
              }}
              color={message?.length < 5 ? '#a6a6a6' : '#000'}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default CreatePostScreen;
