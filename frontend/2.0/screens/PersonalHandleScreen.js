import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {setUsername} from '../../redux/tempUserSlice'; // Redux action
import axios from 'axios';
import {getColorsForTheme, server} from '../strings';

const PersonalHandle = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [localUsername, setLocalUsername] = useState(''); // Renamed local state
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); // Track availability
  const [checkingUsername, setCheckingUsername] = useState(false); // Show loading state during availability check
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  // Function to check username availability
  const checkUsername = async username => {
    setCheckingUsername(true);
    try {
      const response = await axios.post(`${server}api/user/checkUsername`, {
        username,
      });
      setIsUsernameAvailable(response.data.isAvailable); // Set availability based on response
    } catch (error) {
      console.error('Error checking username availability:', error);
      setIsUsernameAvailable(false); // Fallback in case of error
    } finally {
      setCheckingUsername(false); // Stop loading indicator
    }
  };

  const submitHandler = () => {
    dispatch(setUsername(localUsername)); // Dispatch the local username
    navigation.navigate('Goal'); // Navigate to the next screen
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

      {/* Description */}
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
          Create a username
        </CustomText>

        {/* Username Input */}
        <TextInput
          value={localUsername}
          maxLength={20}
          onChangeText={e => {
            const formattedUsername = e
              .toLowerCase()
              .replace(/[^a-z0-9-_ ]/g, '') // Allow spaces temporarily
              .replace(/\s+/g, '_'); // Replace spaces with underscores
            setLocalUsername(formattedUsername); // Update local state

            if (formattedUsername.length >= 3) {
              checkUsername(formattedUsername); // Check availability
            }
          }}
          autoFocus
          placeholder="Username"
          placeholderTextColor={colors.secondaryColor}
          style={{
            fontFamily: 'GeneralSans-SemiBold',
            fontSize: 30,
            color: colors.mainTextColor,
            width: 400,
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: 10,
          }}
        />

        {/* Username Availability Status */}
        {checkingUsername ? (
          <ActivityIndicator size="small" color={colors.secondaryColor} />
        ) : (
          localUsername.length >= 3 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Icon
                name={isUsernameAvailable ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={isUsernameAvailable ? '#00A67E' : colors.secondaryColor}
              />
              <CustomText
                style={{
                  fontFamily: 'GeneralSans-Medium',
                  fontSize: 14,
                  color: isUsernameAvailable
                    ? '#00A67E'
                    : colors.secondaryColor,
                  alignSelf: 'center',
                  marginLeft: 3,
                }}>
                {isUsernameAvailable ? 'Available' : 'Unavailable'}
              </CustomText>
            </View>
          )
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={submitHandler}
        disabled={!isUsernameAvailable || localUsername.length < 3} // Disable if unavailable or too short
        style={{
          marginTop: 15,
          alignItems: 'center',
          backgroundColor:
            !isUsernameAvailable || localUsername.length < 3
              ? colors.disabledColor
              : colors.mainColor,
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
        {loading ? (
          <ActivityIndicator size={20} color={'#fff'} />
        ) : (
          <CustomText
            style={{
              fontSize: 16,
              color: '#000',
              fontFamily: 'GeneralSans-SemiBold',
            }}>
            Continue
          </CustomText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PersonalHandle;
