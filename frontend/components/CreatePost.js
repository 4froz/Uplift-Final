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
import React, {useEffect, useState, memo} from 'react';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import ImageCropPicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';

const CreatePost = () => {
  const [reply, setReply] = useState('');
  const [result, setresult] = useState(null);
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const userInfo = useSelector(state => state.userInfo);
  const dispatch = useDispatch();
  const loading = false;
  const navigation = useNavigation();



  const RemoteImage = ({uri, desiredWidth}) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0);

    Image.getSize(uri, (width, height) => {
      if (result) {
        setDesiredHeight((desiredWidth / width) * height);
      }
    });

    return (
      <Image
        source={{uri}}
        style={{
          borderWidth: 1,
          width: desiredWidth,
          height: desiredHeight,
          borderRadius: 30,
          marginVertical: 5,
          backgroundColor: '#404040',
          marginBottom: 20,
          alignSelf: 'center',
          marginTop: 15,
        }}
      />
    );
  };

  return (
    <>
      {loading || uploading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            padding: 5,
            justifyContent: 'center',
          }}>
         
          <CustomText style={{fontSize: 16}}>
            Uploading Snippet. Plz wait.....
          </CustomText>
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 10,
            alignItems: 'center',
            borderBottomWidth: 0.4,
            borderBottomColor: '#404040',
          }}>
          <Image
            style={{
              width: '10.2%',
              height: 36,
              borderRadius: 100,
              alignSelf: 'flex-start',
              backgroundColor: '#404040',
            }}
            source={{
              uri: userInfo?.profilePic
                ? userInfo?.profilePic
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
            }}
          />
          <View style={{flexDirection: 'column', width: '85%'}}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={100}
              behavior="padding">
              <CustomText bold style={{fontSize: 15}}>
                {userInfo?.id}
              </CustomText>
              <TextInput
                value={reply}
                onChangeText={e => setReply(e)}
                multiline={true}
                style={{
                  width: '100%',
                  fontFamily: 'ProximaNova-Regular',
                  padding: 0,
                  fontSize: 16,
                  marginTop: 10,
                  color: '#fff',
                }}
                placeholderTextColor={'#404040'}
                placeholder="Start a Post"
              />
            </KeyboardAvoidingView>

            <View style={{}}>
              {!result ? (
                <TouchableOpacity
                  onPress={() => handleImagePicker()}
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="image-outline"
                    size={25}
                    style={{marginRight: 2}}
                    color="#fff"
                  />
                  <CustomText style={{fontSize: 15, marginLeft: 10}}>
                    Add a Pic
                  </CustomText>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleImagePicker()}>
                  <RemoteImage
                    desiredWidth={Dimensions.get('window').width - 90}
                    uri={
                      result
                        ? result.path
                        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png?20220519031949'
                    }
                    resizeMode={'contain'}
                  />
                  {result != '' && (
                    <TouchableOpacity
                      onPress={() => setresult(null)}
                      style={{
                        alignItems: 'flex-end',
                        position: 'absolute',
                        top: 20,
                        right: 1,
                      }}>
                      <Icon
                        name="close-outline"
                        size={30}
                        style={{marginLeft: 2, marginRight: 15}}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              )}

              {reply.length < 5 ? (
                <TouchableOpacity
                  style={{
                    width: '31%',
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    borderRadius: 20,
                    paddingVertical: 8,
                    backgroundColor: '#404040',
                  }}>
                  <CustomText
                    bold
                    style={{
                      fontSize: 16,
                      color: '#000',
                    }}>
                    Upload
                  </CustomText>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    alignItems: 'flex-end',
                  }}>
                  <CustomText
                    bold
                    style={{
                      fontSize: 16,
                      color: '#000',
                    }}>
                    Upload
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* <TouchableOpacity style={{width:"15%",alignItems:'flex-end'}}>
    <CustomText bold style={{fontSize: 15}}>
      POST
    </CustomText>
  </TouchableOpacity> */}
        </View>
      )}
    </>
  );
};

export default memo(CreatePost);
