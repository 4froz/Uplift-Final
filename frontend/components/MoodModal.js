import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  FlatList,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import CustomText from './CustomText';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { login } from '../redux/UserSlice';

const MoodModal = ({ show, setShow, getUser }) => {
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState('');
  const userInfo = useSelector(state => state.userInfo);
  const dispatch = useDispatch();
  // Function to change the mood
  const changeMood = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `https://68de-2409-40c2-4001-748c-dd98-9a25-23a2-ed68.ngrok-free.app/api/user/mood/${userInfo._id}/`,
        { mood }
      );
      ToastAndroid.show('Mood updated', 1000);
      setLoading(false);
      dispatch(
        login({
          _id:userInfo._id,
          name: response.data.name,
          email: response.data.email,
          profilePic: response.data.profilePic,
          mood: response.data.mood,
        }),
      );
      getUser();
      setShow(false);
    } catch (error) {
      console.error('Error updating mood:', error.message);
      Alert.alert(error.message, 'Please try again');
      setLoading(false);
    }
  };

  // Use effect to handle loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer); // Clean up timer
  }, []);

  // Animation for modal transition
  const bottomValue = useRef(new Animated.Value(300)).current;
  useEffect(() => {
    Animated.timing(bottomValue, {
      toValue: show ? 1 : 300,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [show]);

  // List of moods
  const moods = [
    'Excited', 'Guilty', 'Powerless', 'Lonely', 'Brave', 'Valued', 'Jealous',
    'Annoyed', 'Creative', 'Curious', 'Affectionate', 'Ashamed', 'Excluded',
    'Hopeful', 'Caring', 'Powerful', 'Bored', 'Hurt', 'Anxious', 'Overwhelmed',
    'Grateful', 'Disappointed', 'Accepted', 'Respected',
  ];

  // Render each mood item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setMood(item.toLowerCase())}
      style={{
        width: '47%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mood === item.toLowerCase() ? '#BB2B00' : '#202020',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 14,
        marginHorizontal: 5,
      }}
    >
      <CustomText
        style={{
          fontSize: 16,
          color: '#fff',
          fontFamily: 'GeneralSans-SemiBold',
        }}
      >
        {item}
      </CustomText>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={show}
      onRequestClose={() => {
        Animated.timing(bottomValue, {
          toValue: 1000,
          duration: 200,
          useNativeDriver: true,
        }).start();
        setTimeout(() => setShow(false), 200);
      }}
      animationType="none"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000AA',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Animated.timing(bottomValue, {
              toValue: 1000,
              duration: 200,
              useNativeDriver: true,
            }).start();
            setTimeout(() => setShow(false), 200);
          }}
          activeOpacity={0.7}
          style={{ height: '20%' }}
        />
        <Animated.View
          style={{
            backgroundColor: '#000',
            width: '100%',
            flexDirection: 'column',
            height: '80%',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            justifyContent: 'space-between',
            transform: [{ translateY: bottomValue }],
          }}
        >
          <View
            style={{
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                width: '100%',
                backgroundColor: '#000',
                padding: 20,
                paddingHorizontal: 10,
                borderRadius: 20,
                height: '100%',
              }}
            >
              {loading ? (
                <ActivityIndicator
                  style={{ borderRadius: 100 }}
                  size={40}
                  color="#BB2B00"
                />
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 5,
                      marginBottom: 10,
                    }}
                  >
                    <CustomText
                      bold
                      style={{
                        fontSize: 18,
                        color: '#fff',
                        fontFamily: 'GeneralSans-SemiBold',
                      }}
                    >
                      How are you feeling right now 🥰
                    </CustomText>
                  </View>
                  <FlatList
                  showsVerticalScrollIndicator={false}
                    data={moods}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2} // Display items in 2 columns
                    style={{ width: '100%', alignSelf: 'center' }}
                    columnWrapperStyle={{ marginBottom: 10, padding: 0 }} // Styling for rows
                  />
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}
                  >
                    {mood === '' ? (
                      <View
                        style={{
                          width: '100%',
                          paddingVertical: 14,
                          backgroundColor: '#262626',
                          borderRadius: 6,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CustomText
                          bold
                          style={{ fontSize: 16, color: '#a6a6a6' }}
                        >
                          Change Mood
                        </CustomText>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={changeMood}
                        activeOpacity={0.9}
                        style={{
                          width: '100%',
                          paddingVertical: 14,
                          backgroundColor: '#BB2B00',
                          borderRadius: 6,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CustomText
                          bold
                          style={{ fontSize: 16, color: '#fff' }}
                        >
                          Change Mood
                        </CustomText>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MoodModal;
