import {View, Text, ToastAndroid} from 'react-native';
import React, {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getColorsForTheme} from '../strings';

const CreateScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  useEffect(() => {
    // Check if the screen is focused
    if (isFocused) {
      // Navigate to another screen

      navigation.navigate('CreatePost');
    }
  }, [isFocused, navigation]);

  // Render your CreatePostScreen UI
  return <View style={{flex: 1, backgroundColor: colors.appColor}}></View>;
};

export default CreateScreen;
