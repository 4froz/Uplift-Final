import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {TextInput} from 'react-native-gesture-handler';

const AgeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleDayChange = (value) => {
    // Allow only numbers, and limit to 2 digits
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setDay(value);
    }
  };

  const handleMonthChange = (value) => {
    // Allow only numbers, and limit to 2 digits
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setMonth(value);
    }
  };

  const handleYearChange = (value) => {
    // Allow only numbers, and limit to 4 digits
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setYear(value);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
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
            fontFamily: 'Lato-Bold',
            fontSize: 26,
            color: '#000',
          }}>
          UpLift
        </CustomText>
      </View>

      {/* Desc */}
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          marginTop: 50,
         alignItems:'center'
        }}>
        <CustomText
          style={{
            fontFamily: 'GeneralSans-SemiBold',
            fontSize: 18,
            color: '#000',
            alignSelf: 'center',
          }}>
          What's your birth year?
        </CustomText>
        <TextInput
          value={name}
          onChange={e => setName(e)}
          autoFocus
          keyboardType='number-pad'
          placeholder="YYYY"
          maxLength={4}
          placeholderTextColor={'#797979'}
          style={{
            fontFamily: 'GeneralSans-SemiBold',
            fontSize: 30,
            color: '#000',
            width:200,
            textAlign:'center',
            // alignSelf: 'center',
            marginTop: 10,
          }}
        />
        <CustomText
          style={{
            fontFamily: 'GeneralSans-Regular',
            fontSize: 18,
            marginTop: 10,
            color: '#797979',
            alignSelf: 'center',
          }}>
          Just to check your old enough to use
        </CustomText>
        <CustomText
          style={{
            fontFamily: 'GeneralSans-Regular',
            fontSize: 18,
            color: '#797979',
            alignSelf: 'center',
          }}>
          UpLift
        </CustomText>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Age')}
        style={{
          marginTop: 15,
          alignItems: 'center',
          backgroundColor: name.length < 3 ? '#797979' : '#1F74FD',
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
            color: '#fff',
            fontFamily: 'GeneralSans-SemiBold',
          }}>
          Continue
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default AgeScreen;
