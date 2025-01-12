import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ToastAndroid,
  Alert,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import CustomText from '../../components/CustomText';
import {useDispatch, useSelector} from 'react-redux';
import { getColorsForTheme, server } from '../strings';
import { set_Email, set_Name, set_Password } from '../../redux/tempUserSlice';
import axios from 'axios';
import { login } from '../../redux/UserSlice';

const LoginScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [pressCount, setPressCount] = useState(0); // Track image press count
  const dispatch = useDispatch();
  const themeMode = useSelector(state => state.theme.themeMode);

  const colors = getColorsForTheme(themeMode);
  
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1059186875993-vn7j67lgreb7p9b25sqeu5e4isi14qmk.apps.googleusercontent.com', // Replace with your web client ID
    });
  }, []);

  const loginUser = async (email, idToken, name) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(`${server}api/user/`, {
          email,
          password: idToken,
          name: name,
        },
      );
      const {data} = response;
      ToastAndroid.show('Login Success', 1000);
      setLoading(false);
      dispatch(login(data));
      navigation.reset({
        index: 0,
        routes: [{ name: "BottomTab" }],
      });
    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error.message);
      Alert.alert("User not found,", 'Please Register in order to get started');
    }
  };

  const signInWithGoogle = async signUp => {
    try {
      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign out of any previously signed-in accounts
      await GoogleSignin.signOut();

      // Initiate sign-in, this will now prompt user to select an account
      const userInfo = await GoogleSignin.signIn();
      
      if (signUp) {
        console.log(userInfo.data.idToken);
        dispatch(set_Email(userInfo.data.user.email));
        dispatch(set_Password(userInfo.data.idToken));
        dispatch(set_Name(userInfo.data.user.name));
        navigation.navigate('Name');
      } else {
        loginUser(
          userInfo.data.user.email,
          userInfo.data.idToken,
          userInfo.data.user.name,
        );
      }

      // Handle user info
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        Alert.alert(error.message);
      }
      console.log(error);
      
    }
  };

  const handleImagePress = () => {
    setPressCount(prevCount => prevCount + 1);

    if (pressCount + 1 === 3) {
      Alert.alert("Server",server) // Log the server value
      setPressCount(0); // Reset the count after logging
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.appColor}}>
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          marginTop: 50,
          alignItems: 'center',
          flex: 1,
          position: 'absolute',
          bottom: 60,
        }}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText
              style={{
                fontFamily: 'GeneralSans-Medium',
                fontSize: 28,
                color: colors.mainColor,
                transform: [{translateY: -5}],
              }}>
              Welcome to
            </CustomText>
            <CustomText
              style={{
                fontFamily: 'Roboto-BoldItalic',
                fontSize: 26,
                color: colors.mainColor,
                marginLeft: 5,
              }}>
              Uplift
            </CustomText>
          </View>
          <CustomText
            style={{
              fontSize: 16,
              textAlign: 'center',
              fontFamily: 'GeneralSans-Regular',
              marginTop: 20,
              width: '83%',
            }}>
            Share your problems, or just talk tap below to get started
          </CustomText>
        </View>

        {/* Image that triggers console log after 3 presses */}
        <TouchableOpacity style={{width:"100%"}} onPress={handleImagePress}>
          <Image
            resizeMode="stretch"
            source={{uri:"https://drive.google.com/uc?export=download&id=1iPPkI8Gd7yhYTGhF7VGbWzbTFPK7VtXw"}}
            style={{width: '100%', height: 250, marginVertical: 40}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signInWithGoogle(true)}
          disabled={loading}
          activeOpacity={0.9}
          style={{
            marginTop: 15,
            alignItems: 'center',
            backgroundColor: colors.mainColor,
            padding: 20,
            borderRadius: 30,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '90%',
            paddingVertical: 20,
          }}>
          {loading ? (
            <ActivityIndicator size={20} color={'#fff'} />
          ) : (
            <CustomText
              style={{
                fontSize: 16,
                color: '#000',
                fontFamily: 'GeneralSans-Medium',
              }}>
              Create Account
            </CustomText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signInWithGoogle(false)}
          disabled={loading}
          activeOpacity={0.9}
          style={{
            marginTop: 15,
            alignItems: 'center',
            backgroundColor: colors.mainColor,
            padding: 20,
            borderRadius: 30,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '90%',
            paddingVertical: 20,
          }}>
          {loading ? (
            <ActivityIndicator size={20} color={'#fff'} />
          ) : (
            <CustomText
              style={{
                fontSize: 16,
                color: '#000',
                fontFamily: 'GeneralSans-Medium',
              }}>
              Login
            </CustomText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
