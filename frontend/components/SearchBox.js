import {View, Image, TouchableOpacity, TextInput} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getColorsForTheme} from '../2.0/strings';
import { useSelector } from 'react-redux';

const SearchBox = ({value, setSearch, searchUser}) => {
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        width: '90%',
        backgroundColor: colors.disabledColor,
        borderRadius: 15,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        marginBottom: 10,
      }}>
      <Icon name="search-outline" color="#9ca3af" size={20} />

      <TextInput
        maxLength={20}
        value={value}
        onChangeText={e => {
          // const formattedUsername = e
          //   .toLowerCase()
          //   .replace(/[^a-z0-9-_ ]/g, '') // Allow spaces temporarily
          //   .replace(/\s+/g, '_'); // Replace spaces with underscores
          setSearch(e); // Update local state

          // searchUser(formattedUsername);
        }}
        placeholder="Search"
        onSubmitEditing={(e) => {
          searchUser(value);
        }}
        placeholderTextColor={'#9ca3af'}
        style={{
          fontFamily: 'GeneralSans-Regular',
          fontSize: 16,
          paddingVertical: 7,
          width: '92%',
          color: colors.mainTextColor,
        }}
      />
    </View>
  );
};

export default SearchBox;
