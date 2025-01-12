import React, {useEffect} from 'react';
import {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  Easing,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {getColorsForTheme} from '../2.0/strings';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';

const FilterUserModal = React.memo(
  ({
    show,
    setShow,
    setFilter,
    goal,
    getOnlineUsers,
    getSameGoalUsers,
    filter,
    getUsers,
  }) => {
    const bottomValue = React.useRef(new Animated.Value(300)).current;
    const activeOpacity = React.useRef(new Animated.Value(0)).current;
    const themeMode = useSelector(state => state.theme.themeMode);

    // Dynamically get the colors based on the current theme
    const colors = getColorsForTheme(themeMode);
    useEffect(() => {
      Animated.timing(bottomValue, {
        toValue: show ? 10 : 450,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start(() => {
        if (!show) setShow(false);
      });
      Animated.timing(activeOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start(() => {
        if (!show) setShow(false);
      });
    }, [show, bottomValue, setShow]);

    const animateModalDown = _goal => {
      Animated.timing(bottomValue, {
        toValue: 1000,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start(() => setShow(false)); // Close the modal after animation completes
      Animated.timing(activeOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start(() => setShow(false)); // Close the modal after animation completes
    };
    return (
      <Modal
        transparent
        statusBarTranslucent
        visible={show}
        onRequestClose={animateModalDown}
        animationType="none">
        <View style={{flex: 1, backgroundColor: '#202020AA'}}>
          <TouchableOpacity
            onPress={() => animateModalDown()}
            activeOpacity={0.7}
            style={{height: '40%', opacity: activeOpacity}}
          />
          <Animated.View
            style={{
              backgroundColor: colors.appColor,
              width: '100%',
              height: '60%',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              padding: 20,
              transform: [{translateY: bottomValue}],
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomText
                style={{
                  fontFamily: 'GeneralSans-Medium',
                  fontSize: 18,
                  alignSelf: 'flex-start',
                  width: 400,
                  marginTop: 10,
                }}>
                Filters
              </CustomText>
              <TouchableOpacity
                onPress={() => {
                  animateModalDown('Academic');
                  setFilter('');
                  getUsers();
                }}
                style={{
                  alignItems: 'flex-end',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}>
                <CustomText
                  style={{
                    fontFamily: 'GeneralSans-Regular',
                    fontSize: 14,
                    alignSelf: 'flex-start',
                    marginTop: 10,
                    color: colors.secondaryColor,
                  }}>
                  Clear filters
                </CustomText>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    animateModalDown('Academic');
                    setFilter('online');
                    getOnlineUsers();
                  }}
                  style={{
                    width: '48%',
                    backgroundColor:
                      filter == 'online'
                        ? colors.mainColor
                        : colors.disabledColor,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}>
                  <CustomText
                    style={{
                      fontSize: 16,
                      fontFamily: 'GeneralSans-Medium',
                      color: filter == 'online' ? '#000' : colors.mainTextColor,
                    }}>
                    Online Users
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    animateModalDown('Academic');
                    setFilter('same');
                    getSameGoalUsers();
                  }}
                  style={{
                    width: '48%',
                    backgroundColor:
                      filter == 'same'
                        ? colors.mainColor
                        : colors.disabledColor,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}>
                  <CustomText
                    style={{
                      fontSize: 16,
                      fontFamily: 'GeneralSans-Medium',
                      color: filter == 'same' ? '#000' : colors.mainTextColor,
                    }}>
                    Same Goals
                  </CustomText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    );
  },
);

export default FilterUserModal;
