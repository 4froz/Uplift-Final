import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import UserCard from '../../components/UserCard';
import CustomText from '../../components/CustomText';
import { getColorsForTheme, server } from '../strings';
import { useSelector } from 'react-redux';

// Memoizing UserCard to prevent unnecessary re-renders
const MemoizedUserCard = React.memo(UserCard);

const FriendsScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {id, myfriends} = route.params;

  // Fetch user requests using useCallback to avoid re-creation on every render
  const getUserRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${server}api/user/friends/${id}`,
      );
      const {data} = response;
      setUsers(data.friends);
    } catch (error) {
      console.error('Error fetching friends:', error.message);
    } finally {
      setLoading(false); // Only set loading false once, avoid redundant state updates
    }
  }, [id]);

  // Run only when the component mounts or the id changes
  useEffect(() => {
    getUserRequests();
  }, [getUserRequests]);

  // Memoize filtered users to avoid filtering on every render
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  // Extracted renderLoading function to avoid inline rendering logic
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

  // Optimized scroll and refresh logic, useCallback for onRefresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserRequests().finally(() => setRefreshing(false));
  }, [getUserRequests]);

  return (
    <>
      {loading ? (
        renderLoading() // Loading component extracted to avoid inline rendering logic
      ) : (
        <View style={{flex: 1, backgroundColor: colors.appColor , padding: 12}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 25,
                marginBottom: 10,
              }}>
              {/* Back button */}
              <TouchableOpacity
                style={{width: '10%'}}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}>
                <Icon
                  name="arrow-back-outline"
                  size={20}
                  style={{marginLeft: 2, marginRight: 15}}
                  color={colors.mainTextColor}
                />
              </TouchableOpacity>

              {/* Friends Header */}
              <CustomText
                bold
                style={{
                  fontSize: 16,
                  color: colors.mainTextColor,
                  fontFamily: 'GeneralSans-Medium',
                }}>
                Friends
              </CustomText>
              <Icon
                name="chevron-back-outline"
                size={25}
                style={{marginLeft: 2, marginRight: 15}}
                color={colors.appColor}
              />
            </View>

            {/* Rendering filtered users, memoized to avoid unnecessary re-renders */}
            {filteredUsers.map(user => (
              <MemoizedUserCard
                key={user._id} // Ensure each item has a unique key
                getUser={getUserRequests}
                friendsScreen={!myfriends} // Avoid creating inline booleans
                myfriends={myfriends}
                user={user}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default FriendsScreen;
