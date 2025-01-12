import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBox from '../../components/SearchBox';
import {getColorsForTheme, server} from '../strings';
import {ScrollView} from 'react-native-gesture-handler';
import UserCard from '../../components/UserCard';
import SearchUserCard from '../components/SearchUserCard';
import CustomText from '../../components/CustomText';
import axios from 'axios';
import {useSelector} from 'react-redux';
import FilterUserModal from '../../components/FilterUserModal';

const SearchScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filter, setfilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModal, setfilterModal] = useState(false);
  const userInfo = useSelector(state => state.userInfo);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  const getusers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}api/user/`);
      const filteredUsers = response.data.filter(
        user => user._id !== userInfo._id,
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false); // Ensure loading state is reset after data is fetched
    }
  }, []);

  const getOnlineUsers = useCallback(async () => {
    try {
      setLoading(true); // Set loading state to true while fetching users
      const response = await axios.get(`${server}api/user/`);
      
      // Filter users to exclude the current user and only show online users
      const filteredUsers = response.data.filter(
        user => user._id !== userInfo._id && user.active == true
      );
      console.log(response.data.filter(
        user => user.active
      ));
      
      // Update the users state with the filtered list
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error.message); // Log any errors
    } finally {
      setLoading(false); // Ensure loading state is reset after data is fetched
    }
  }, [userInfo._id]);
console.log("123"+userInfo.goalCategory);

  const getSameUsers = useCallback(async () => {
    try {
      setLoading(true); // Set loading state to true while fetching users
      const response = await axios.get(`${server}api/user/`);
      
      // Filter users to exclude the current user and only show online users
      const filteredUsers = response.data.filter(
        user => user._id !== userInfo._id && user.goalCategory == userInfo.goalCategory
      );
      console.log(response.data.filter(
        user => user.goalCategory
      ));
      
      // Update the users state with the filtered list
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error.message); // Log any errors
    } finally {
      setLoading(false); // Ensure loading state is reset after data is fetched
    }
  }, [server, userInfo._id]);

  useEffect(() => {
    getusers();
  }, [getusers]);

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
      {loading ? (
        renderLoading() // Loading component extracted to avoid inline logic
      ) : (
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
              <TouchableOpacity
                onPress={() => navigation.navigate('MainSearch')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  width: '76%',
                  backgroundColor: colors.disabledColor,
                  borderRadius: 15,
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  paddingVertical: 5,
                }}>
                <Icon name="search-outline" color="#9ca3af" size={20} />

                <View
                  style={{
                    fontFamily: 'GeneralSans-Regular',
                    fontSize: 16,
                    paddingVertical: 7,
                    width: '92%',
                    color: '#fff',
                    marginLeft: 7,
                  }}>
                  <CustomText
                    style={{
                      fontFamily: 'GeneralSans-Regular',
                      fontSize: 16,
                      color: '#9ca3af',
                    }}>
                    Search for users
                  </CustomText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{width: '10%'}}
                onPress={() => {
                  setfilterModal(true);
                }}
                activeOpacity={0.7}>
                <Icon
                  name="options"
                  size={25}
                  style={{}}
                  color={colors.mainTextColor}
                />
              </TouchableOpacity>
            </View>
            {users.map(user => (
              <SearchUserCard key={user._id} user={user} />
            ))}
            <FilterUserModal
              show={filterModal}
              setShow={setfilterModal}
              filter={filter}
              setFilter={setfilter}
              getOnlineUsers={getOnlineUsers}
              getUsers={getusers}
              getSameGoalUsers={getSameUsers}
            />
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default SearchScreen;
