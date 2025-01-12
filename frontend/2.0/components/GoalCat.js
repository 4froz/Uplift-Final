import React, {useEffect} from 'react';
import {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  Easing,
  ScrollView,
} from 'react-native';
import {getColorsForTheme} from '../strings';
import CustomText from '../../components/CustomText';
import {useSelector} from 'react-redux';

const GoalCatModal = React.memo(({show, setShow, setCat, goal}) => {
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
              Select Goal Category
            </CustomText>

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
                  setCat('Academic');
                }}
                style={{
                  width: '48%',
                  height: 150,
                  backgroundColor: colors.disabledColor,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CustomText
                  style={{
                    fontSize: 32,
                    fontFamily: 'GeneralSans-Medium',
                  }}>
                  📚
                </CustomText>
                <CustomText
                  style={{
                    fontSize: 20,
                    fontFamily: 'GeneralSans-Medium',
                    marginTop: 10,
                  }}>
                  Academic
                </CustomText>
                <CustomText
                  style={{
                    fontSize: 20,
                    fontFamily: 'GeneralSans-Medium',
                  }}>
                  Goal
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  animateModalDown('Financial');
                  setCat('Financial');
                }}
                style={{
                  width: '48%',
                  height: 150,
                  backgroundColor: colors.disabledColor,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CustomText
                  style={{
                    fontSize: 32,
                    fontFamily: 'GeneralSans-Medium',
                  }}>
                  💵
                </CustomText>
                <CustomText
                  style={{
                    fontSize: 20,
                    fontFamily: 'GeneralSans-Medium',
                    marginTop: 10,
                  }}>
                  Financial
                </CustomText>
                <CustomText
                  style={{
                    fontSize: 20,
                    fontFamily: 'GeneralSans-Medium',
                  }}>
                  Goal
                </CustomText>
              </TouchableOpacity>
            </View>

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
                  animateModalDown('Health');
                  setCat('Health');
                }}
                style={{
                  width: '48%',
                  height: 150,
                  backgroundColor: colors.disabledColor,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CustomText
                  style={{
                    fontSize: 32,
                    fontFamily: 'GeneralSans-Medium',
                  }}>
                  💪
                </CustomText>
                <CustomText
                  style={{
                    fontSize: 20,
                    fontFamily: 'GeneralSans-Medium',
                    marginTop: 10,
                  }}>
                  Health
                </CustomText>
                <CustomText
                  style={{
                    fontSize: 20,
                    fontFamily: 'GeneralSans-Medium',
                  }}>
                  Goal
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  animateModalDown('Growth');
                  setCat('Growth');
                }}
                style={{
                  width: '48%',
                  height: 150,
                  backgroundColor: colors.disabledColor,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CustomText
                  style={{
                    fontSize: 32,
                    fontFamily: 'GeneralSans-Medium',
                  }}>
                  📈
                </CustomText>
                <CustomText
                  style={{
                    fontSize: 20,
                    fontFamily: 'GeneralSans-Medium',
                    marginTop: 10,
                  }}>
                  Growth
                </CustomText>
                <CustomText
                  style={{
                    fontSize: 20,
                    fontFamily: 'GeneralSans-Medium',
                  }}>
                  Goal
                </CustomText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                animateModalDown('Other');
                setCat('Other');
              }}
              style={{
                width: '48%',
                height: 150,
                backgroundColor: colors.disabledColor,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <CustomText
                style={{
                  fontSize: 20,
                  fontFamily: 'GeneralSans-Medium',
                  marginTop: 10,
                }}>
                Other..
              </CustomText>
              <CustomText
                style={{
                  fontSize: 20,
                  fontFamily: 'GeneralSans-Medium',
                }}>
                Goal
              </CustomText>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
});

export default GoalCatModal;
