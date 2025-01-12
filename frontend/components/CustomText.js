import { Text } from 'react-native';
import React from 'react';
import { getColorsForTheme, } from '../2.0/strings';
import { useSelector } from 'react-redux';

const CustomText = ({
  bold,
  extra,
  normal,
  semibold,
  style,
  numberOfLines,
  onPress,
  children,
}) => {
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={{
        fontFamily:extra
        ? 'Lato-Black'
        : bold
          ? 'Lato-Bold'
          : semibold
          ? 'Lato-SemiBold'
          : normal
          ? 'Lato-Regular'
          : 'Lato-Regular',
        color: colors.mainTextColor,
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default CustomText;
