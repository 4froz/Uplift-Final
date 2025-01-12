import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  Animated, // Import Animated for animations
  Easing,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import CustomText from './CustomText';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {getColorsForTheme, server} from '../2.0/strings';
import GoalCatModal from '../2.0/components/GoalCat';
import {login} from '../redux/UserSlice';
import Icon from 'react-native-vector-icons/Ionicons';


const ChangeName = ({show, setShow, getUser, userInfo}) => {
  const [name, setname] = useState(''); // State for storing user input for name
  const [username, setusername] = useState(''); // State for storing user input for name
  const [loading, setLoading] = useState(false);
  const [goalModal, setgoalModal] = useState(false); // State for handling loading state during API call
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  const translateY = useRef(new Animated.Value(300)).current; // Initial value for Y position of modal content

  // Function to animate the modal content coming up from the bottom
  const animateModalUp = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); // Track availability
  const [checkingUsername, setCheckingUsername] = useState(false); //
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

  // Function to animate the modal content going down to close
  const animateModalDown = () => {
    Animated.timing(translateY, {
      toValue: 1000,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => setShow(false)); // Close the modal after animation completes
  };

  // Start the animation when the modal is shown
  useEffect(() => {
    if (show) {
      animateModalUp();
    }
  }, [show]);

  useEffect(() => {
    setname(userInfo?.name);
    setusername(userInfo?.username);
  }, []);

  

  const dispatch = useDispatch();
  useEffect(() => {
   username == userInfo?.username && setIsUsernameAvailable(true)
  }, [username])
  
  // Function to handle name change
  const changename = async () => {
    try {
      setLoading(true); // Start loading when the request is made
      const response = await axios.put(
        `${server}api/user/name/${userInfo._id}/`,
        {name: name, username: username}, // Sending name in the request body
        {headers: {'Content-Type': 'application/json'}},
      );
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
      ToastAndroid.show('Name Changed Successfully', ToastAndroid.SHORT); // Show success message
      setname('');
      setusername('');
      getUser(); // Refresh user data after successfully changing name
      animateModalDown(); // Animate the modal down to close
    } catch (error) {
      console.error('Error changing name:', error.message); // Log the error
      Alert.alert('Error', 'Failed to change name. Please try again.'); // Show alert for error
    } finally {
      setLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={show}
      onRequestClose={animateModalDown} // Animate down when the modal is closed
      animationType="none" // Disable default animations
    >
      <KeyboardAvoidingView style={{flex: 1}} behavior="height">
        {/* Overlay background */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#000000AA',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={animateModalDown} // Close the modal when clicking the background
        >
          {/* Animated modal container */}
          <Animated.View
            style={{
              transform: [{translateY}],
              width: '90%',
              backgroundColor: colors.appColor,
              padding: 20,
              paddingVertical: 25,
              borderRadius: 20,
            }}>
            {/* Show loading indicator or content */}
            {loading ? (
              <ActivityIndicator
                size={40}
                color={colors.mainColor}
                style={{borderRadius: 100}}
              />
            ) : (
              <>
                {/* Title */}
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
                    Name
                  </CustomText>
                </View>

                {/* Text input for name */}
                <TextInput
                  autoFocus
                  maxLength={20}
                  multiline
                  value={name}
                  onChangeText={text => setname(text)}
                  style={{
                    width: '100%',
                    fontSize: 16,
                    fontFamily: 'GeneralSans-Regular',
                    // marginTop: 5,
                    fontFamily: 'GeneralSans-Regular',
                    color: colors.mainTextColor,
                  }}
                  placeholder="Your Name"
                  placeholderTextColor={'#a6a6a6'}
                />
                <CustomText
                  bold
                  style={{
                    fontSize: 18,
                    marginTop: 10,
                    fontFamily: 'GeneralSans-SemiBold',
                  }}>
                  Username
                </CustomText>
                <TextInput
                  autoFocus
                  maxLength={80}
                  multiline
                  value={username}
                  onChangeText={text => {
                    const formattedUsername = text
                      .toLowerCase()
                      .replace(/[^a-z0-9-_ ]/g, '') // Allow spaces temporarily
                      .replace(/\s+/g, '_'); // Replace spaces with underscores
                    setusername(formattedUsername); // Update local state

                    if (formattedUsername?.length >= 3) {
                      checkUsername(formattedUsername); // Check availability
                    }
                  }}
                  style={{
                    width: '100%',
                    fontSize: 16,
                    fontFamily: 'GeneralSans-Regular',
                    fontFamily: 'GeneralSans-Regular',
                  }}
                  placeholder="Your username"
                  placeholderTextColor={'#a6a6a6'}
                />
                {checkingUsername ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.secondaryColor}
                  />
                ) : (
                  username?.length >= 3 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <Icon
                        name={
                          isUsernameAvailable
                            ? 'checkmark-circle'
                            : 'close-circle'
                        }
                        size={16}
                        color={
                          isUsernameAvailable
                            ? '#00A67E'
                            : colors.secondaryColor
                        }
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
                {/* Buttons: Cancel and Add */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    marginTop: 20,
                    justifyContent: 'space-between',
                  }}>
                  {/* Cancel button */}
                  <TouchableOpacity
                    onPress={animateModalDown} // Close the modal with animation
                    activeOpacity={0.9}
                    style={{
                      width: '45%',
                      paddingVertical: 14,
                      backgroundColor: colors.disabledColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                    }}>
                    <CustomText
                      bold
                      style={{
                        fontSize: 15,
                        fontFamily: 'GeneralSans-Regular',
                      }}>
                      Cancel
                    </CustomText>
                  </TouchableOpacity>

                  {/* Add button - disabled if name length <= 5 */}

                  <TouchableOpacity
                    onPress={changename}
                    disabled={name?.length < 3 || !isUsernameAvailable || username?.length < 3}
                    activeOpacity={0.9}
                    style={{
                      width: '45%',
                      paddingVertical: 14,
                      backgroundColor:
                        name?.length < 3 || !isUsernameAvailable || username?.length < 3
                          ? colors.disabledColor
                          : colors.mainColor,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <CustomText
                      bold
                      style={{
                        fontSize: 16,
                        fontFamily: 'GeneralSans-Regular',
                        color:
                          name?.length < 3 ? colors.secondaryColor : '#000',
                      }}>
                      Change
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChangeName;
