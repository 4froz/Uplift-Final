import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, {useEffect, useState, memo} from 'react';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import FollowModal from '../modals/FollowModal';

const CommentScreenCard = () => {
  const navigation = useNavigation();
  const [show, setshow] = useState(false);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
      }}>
      <FollowModal show={show} setShow={setshow} />
      <View style={{width: '10.2%', alignSelf: 'flex-start'}}>
        <TouchableOpacity onPress={() => setshow(true)}>
          <Image
            style={{
              width: '100%',
              height: 36,
              borderRadius: 100,
              backgroundColor:"#404040"
            }}
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
            }}
          />
          <Icon
            name="add-circle"
            color="#fff"
            size={20}
            style={{position: 'absolute', bottom: -2, right: -5}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'column', width: '88%'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <CustomText bold style={{}}>
              nehu__08
            </CustomText>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText bold style={{marginLeft: 20, color: '#fff'}}>
              X A
            </CustomText>
          </View>
        </View>
        <CustomText style={{marginLeft: 5, marginVertical: 5, marginTop: 5}}>
          Ice Caves in so many secrets! The ice is so old and dense that lights
          reflex light in a complex way...
        </CustomText>
        <Image
          style={{
            width: '100%',
            marginTop: 10,
            height: 400,
            borderRadius: 10,
            backgroundColor:"#404040"
          }}
          source={{
            uri: 'https://wallpapers.com/images/hd/aesthetic-girl-pictures-xl7ethtg7gozi3mx.jpg',
          }}
        />
      </View>
    </View>
  );
};

export default CommentScreenCard;
