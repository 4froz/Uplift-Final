import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {login} from '../../redux/UserSlice';
import {getColorsForTheme, server} from '../strings';
import GoalCatModal from '../components/GoalCat';
import axios from 'axios';

const GoalSelector = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [skiploading, setskipLoading] = useState(false);
  const [goalModal, setgoalModal] = useState(false);
  const dispatch = useDispatch();
  const [goal, setgoal] = useState('');
  const [goalCat, setgoalCat] = useState('');
  const tempUser = useSelector(state => state.tempUser); // Redux selector to get user information
  console.log(
    tempUser.email,
    tempUser.password,
    tempUser.name,
    tempUser.username,
    goal,
    goalCat,
  );
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  const submitHandler = async (email, idToken, name) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(`${server}api/user/`, {
        email: tempUser.email,
        password: "123445",
        name: tempUser.name,
        username: tempUser.username,
        goal: goal,
        goalCategory: goalCat,
      });
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
      Alert.alert(error.message, 'Please Recheck you Email And Password');
    }
  };

  const skipHandler = async (email, idToken, name) => {
    try {
      setskipLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(`${server}api/user/`, {
        email: tempUser.email,
        password: "123445",
        name: tempUser.name,
        username: tempUser.username,
        goal: goal,
        goalCategory: goalCat,
      });
      const {data} = response;
      ToastAndroid.show('Login Success', 1000);
      setskipLoading(false);
      dispatch(login(data));
      navigation.reset({
        index: 0,
        routes: [{ name: "BottomTab" }],
      });
    } catch (error) {
      console.error('Error logging in:', error.message);
      Alert.alert(error.message, 'Please Recheck you Email And Password');
      setskipLoading(false);
    }
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
          Do you have a goal?
        </CustomText>
        <TextInput
          value={goal}
          onChangeText={setgoal} // Use onChangeText here
          autoFocus
          maxLength={60}
          placeholder="My goal is to build a good physique.."
          placeholderTextColor={colors.secondaryColor}
          style={{
            fontFamily: 'GeneralSans-SemiBold',
            fontSize: 18,
            color: colors.mainTextColor,
            width: 400,
            // textAlign: 'center',
            // alignSelf: 'center',
            marginTop: 20,
          }}
        />
        <CustomText
          style={{
            fontFamily: 'GeneralSans-Medium',
            fontSize: 16,
            alignSelf: 'flex-start',
            width: 400,
            marginTop: 20,
          }}>
          Select Goal Category
        </CustomText>

        <TouchableOpacity
          onPress={() => setgoalModal(true)}
          activeOpacity={0.9}
          style={{
            marginTop: 15,
            alignItems: 'center',
            backgroundColor: colors.appColor,
            padding: 20,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            borderWidth: 1,
            borderColor: colors.secondaryColor,
            paddingVertical: 15,
          }}>
          <CustomText
            style={{
              fontSize: 16,
              color: goalCat ? colors.mainTextColor : colors.secondaryColor,
              fontFamily: 'GeneralSans-Medium',
            }}>
            {goalCat ? goalCat : 'No Category Selected'}
          </CustomText>
        </TouchableOpacity>
        <CustomText
          style={{
            fontFamily: 'GeneralSans-Regular',
            fontSize: 16,
            marginTop: 20,
            color: colors.secondaryColor,
            textAlign: '',
            alignSelf: 'center',
          }}>
          By sharing your goals with us you can connect with like-minded people
          to achieve your goals faster
        </CustomText>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          disabled={skiploading}
          onPress={skipHandler}
          style={{
            marginTop: 15,
            alignItems: 'center',
            backgroundColor: colors.disabledColor,
            padding: 20,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '48%',
            paddingVertical: 15,
          }}>
          {skiploading ? (
            <ActivityIndicator size={20} color={'#fff'} />
          ) : (
            <CustomText
              style={{
                fontSize: 16,
                color: colors.secondaryColor,
                fontFamily: 'GeneralSans-SemiBold',
              }}>
              Skip
            </CustomText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={submitHandler}
          disabled={loading}
          style={{
            marginTop: 15,
            alignItems: 'center',
            backgroundColor:
              goal.length < 8 || goalCat < 3
                ? colors.disabledColor
                : colors.mainColor,
            padding: 20,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '48%',
            paddingVertical: 15,
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
      <GoalCatModal
        goal={goalCat}
        setCat={setgoalCat}
        show={goalModal}
        setShow={setgoalModal}
      />
    </View>
  );
};

export default GoalSelector;
