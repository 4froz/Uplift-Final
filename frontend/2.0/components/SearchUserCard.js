import {View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { getColorsForTheme}  from '../strings';
import { useSelector } from 'react-redux';

const UserCard = ({user}) => {
  const navigation = useNavigation();
  const [unfriendModal, setUnfriendModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading || loadingRequest}
      onPress={() => navigation.navigate('UserProfile', {id: user._id})}
      style={{
        flexDirection: 'column',
        backgroundColor: colors.disabledColor,
        elevation: 0,
        shadowColor: '#000',
        width: '100%',
        padding: 15,
        alignItems: 'center',
        paddingVertical: 20,
        borderColor: '#404040',
        marginTop: 15,
        borderRadius: 10,
        borderBottomWidth: 0,
      }}>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            style={{borderRadius: 100}}
            size={40}
            color={colors.mainColor}
          />
          <View
            style={{
              position: 'absolute',
              width: 30,
              height: 30,
              backgroundColor: '#181818',
              alignSelf: 'center',
              borderRadius: 100,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#fff',
              backgroundColor: '#404040',
            }}
            source={{
              uri:
                user?.profilePic ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              width: '80%',
            }}>
            <CustomText
              style={{

                fontSize: 14,
                fontFamily: 'GeneralSans-SemiBold',
              }}>
              {user?.username} 
            </CustomText> 

            <CustomText
              numberOfLines={1}
              style={{

                fontSize: 14,
                fontFamily: 'GeneralSans-Regular',
                marginTop: 2,
              }}>
              {user?.name}
            </CustomText>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(UserCard);
