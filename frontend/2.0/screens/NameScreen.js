import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {TextInput} from 'react-native-gesture-handler';
import {getColorsForTheme} from '../strings';
import {set_Name} from '../../redux/tempUserSlice';

const NameScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const tempUser = useSelector(state => state.tempUser); // Redux selector to get user information
  const [name, setName] = useState('');
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  useEffect(() => {
    setName(tempUser.name);
  }, []);

  const submitHandler = () => {
    dispatch(set_Name(name));
    navigation.navigate('PersonalHandle');
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.appColor}}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 40,
        }}>
     <CustomText
              style={{
                fontFamily: 'Roboto-BoldItalic',
                fontSize: 26,
                color: colors.mainColor,
                marginLeft: 5,
              //  backgroundColor:"#fff",
              }}>
              Uplift
            </CustomText>
      </View>

      {/* Desc */}
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          marginTop: 50,
        }}>
        <CustomText
          style={{
            fontFamily: 'GeneralSans-Medium',
            fontSize: 18,
            alignSelf: 'center',
          }}>
          What's your first name ?
        </CustomText>
        <TextInput
          value={name}
          onChange={e => setName(e)}
          // autoFocus
          maxLength={50}
          placeholder="Your Name"
          placeholderTextColor={colors.secondaryColor}
          style={{
            fontFamily: 'GeneralSans-SemiBold',
            fontSize: 30,
            color: colors.mainTextColor,
            width: 200,
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: 10,
          }}
        />
        <CustomText
          style={{
            fontFamily: 'GeneralSans-Regular',
            fontSize: 18,
            marginTop: 10,
            color: colors.secondaryColor,
            alignSelf: 'center',
          }}>
          What your friends call you
        </CustomText>
      </View>
      <TouchableOpacity
        onPress={submitHandler}
        disabled={name.length < 3}
        style={{
          marginTop: 15,
          alignItems: 'center',
          backgroundColor:
            name.length < 3 ? colors.disabledColor : colors.mainColor,
          padding: 20,
          borderRadius: 15,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '90%',
          paddingVertical: 15,
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
        }}>
        <CustomText
          style={{
            fontSize: 16,
            color: '#000',
            fontFamily: 'GeneralSans-SemiBold',
          }}>
          Continue
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default NameScreen;
