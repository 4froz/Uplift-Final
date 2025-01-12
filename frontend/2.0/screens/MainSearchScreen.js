import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBox from '../../components/SearchBox';
import {
  getColorsForTheme,
  server,
} from '../strings';
import {ScrollView} from 'react-native-gesture-handler';
import UserCard from '../../components/UserCard';
import SearchUserCard from '../components/SearchUserCard';
import CustomText from '../../components/CustomText';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MainSearch = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode)
  const searchUsername = async username => {
    setLoading(true);
    try {
      const response = await axios.post(`${server}api/user/search`, {
        query: username,
      });
      setUsers(response.data.searchResults); // Set availability based on response
    } catch (error) {
      console.error('Error checking username availability:', error);
      setLoading(false); // Fallback in case of error
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const renderLoading = () => (
    <View
    style={{
      flex: 1,
      backgroundColor: colors.appColor,
      padding: 5,
      justifyContent: 'center',
    }}>
    <ActivityIndicator
      size={50}
      color={colors.mainColor}
      style={{borderRadius: 100}}
    />
    <View
      style={{
        position: 'absolute',
        width: 38,
        height: 38,
        backgroundColor: colors.appColor,
        alignSelf: 'center',
        borderRadius: 100,
      }}
    />
  </View>
  );
  return (
    <>
      <View
        style={{
          backgroundColor: colors.appColor,
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 10,
        }}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            {/* Back Button */}
            <TouchableOpacity
              style={{width: '10%'}}
              onPress={() => {
                navigation.goBack();
              }}
              activeOpacity={0.7}>
              <Icon
                name="arrow-back-outline"
                size={25}
                style={{marginLeft: 2, marginRight: 15}}
                color={colors.mainTextColor}
              />
            </TouchableOpacity>

            {/* Search Box */}
            <SearchBox
              searchUser={searchUsername}
              setSearch={setSearch}
              value={search}
            />
          </View>

          {loading ? (
            renderLoading() // Loading component extracted to avoid inline logic
          ) : (
            <>
              {users?.length > 0 && (
                <>
                  {users?.map(user => (
                    <SearchUserCard key={user._id} user={user} />
                  ))}
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default MainSearch;
