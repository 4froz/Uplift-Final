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
import { login } from '../redux/UserSlice';

const ChangeGoalModal = ({show, setShow, getUser}) => {
  const [bio, setBio] = useState(''); // State for storing user input for bio
  const [goalCat, setgoalCat] = useState(''); // State for storing user input for bio
  const [loading, setLoading] = useState(false);
  const [goalModal, setgoalModal] = useState(false); // State for handling loading state during API call
  const userInfo = useSelector(state => state.userInfo); // Getting user information from Redux store
  const themeMode = useSelector(state => state.theme.themeMode);
  const dispatch = useDispatch();
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

  // Function to handle bio change
  const changeBio = async () => {
    try {
      setLoading(true); // Start loading when the request is made
      const response = await axios.put(
        `${server}api/user/goal/${userInfo._id}/`,
        {goal: bio, goalCategory: goalCat}, // Sending bio in the request body
        {headers: {'Content-Type': 'application/json'}},
      );
        console.log(goalCat);
        dispatch(login(response.data))
      ToastAndroid.show('Goal Changed Successfully', ToastAndroid.SHORT); // Show success message
      getUser(); // Refresh user data after successfully changing bio
      animateModalDown(); // Animate the modal down to close
    } catch (error) {
      console.error('Error changing bio:', error.message); // Log the error
      Alert.alert('Error', 'Failed to change bio. Please try again.'); // Show alert for error
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
                      fontFamily: 'GeneralSans-Regular',
                    }}>
                    Change your goal
                  </CustomText>
                </View>

                {/* Text input for bio */}
                <TextInput
                  autoFocus
                  maxLength={80}
                  multiline
                  value={bio}
                  onChangeText={text => setBio(text)}
                  style={{
                    width: '100%',
                    fontSize: 16,
                    fontFamily: 'GeneralSans-Regular',
                    marginTop: 10,
                    fontFamily: 'GeneralSans-Regular',
                    color: colors.mainTextColor,
                  }}
                  placeholder="Your Goal"
                  placeholderTextColor={'#a6a6a6'}
                />
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
                      fontFamily: 'GeneralSans-Regular',
                      color: goalCat
                        ? colors.mainTextColor
                        : colors.secondaryColor,
                      fontFamily: 'GeneralSans-Medium',
                    }}>
                    {goalCat ? goalCat : 'No Category Selected'}
                  </CustomText>
                </TouchableOpacity>
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

                  {/* Add button - disabled if bio length <= 5 */}

                  <TouchableOpacity
                    onPress={changeBio}
                    disabled={bio.length < 8 || goalCat < 3}
                    activeOpacity={0.9}
                    style={{
                      width: '45%',
                      paddingVertical: 14,
                      backgroundColor:
                        bio.length < 8 || goalCat < 3
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
                          bio.length < 8 || goalCat < 3
                            ? colors.secondaryColor
                            : '#000',
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
      <GoalCatModal
        goal={goalCat}
        setCat={setgoalCat}
        show={goalModal}
        setShow={setgoalModal}
      />
    </Modal>
  );
};

export default ChangeGoalModal;
