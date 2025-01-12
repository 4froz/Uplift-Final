import React, {memo, useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {io} from 'socket.io-client';
import {getColorsForTheme, server} from '../strings';
import CustomText from '../../components/CustomText';
import moment from 'moment';
import PostCard from '../components/PostCard';
import {useSelector} from 'react-redux';
const socket = io(`${server}`);

const HomeScreen = ({navigation}) => {
  const [items, setItems] = useState([]); // State for items
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [refreshing, setRefreshing] = useState(false); // Refreshing state
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  console.log('12345' + themeMode);

  // Fetch posts from server
  const fetchItems = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`${server}api/posts/`);
      setItems(response.data.posts); // Update items with fetched data
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false); // Stop loading whether successful or not
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchItems();

    // Join socket room for real-time updates
    socket.emit('joinRoom', 'home');

    // Listen for new posts from socket
    socket.on('posted', data => {
      setItems(prevItems => [data.post, ...prevItems]);
    });

    return () => {
      // Cleanup socket connection on unmount
      socket.off('posted');
    };
  }, []);

  // Handle refreshing
  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    await fetchItems(); // Re-fetch items
    setRefreshing(false); // Stop refreshing
    socket.emit('joinRoom', 'home');
  };

  return (
    <>
      {isLoading ? (
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
      ) : (
        <View style={{flex: 1, backgroundColor: colors.appColor}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginTop: 40,
              alignItems: 'center',
              marginBottom: 10,
            }}>
           <CustomText
              style={{
                fontFamily: 'Roboto-BoldItalic',
                fontSize: 26,
                color: colors.mainColor,
                marginLeft: 5,
              //  backgroundColor:"#fff",
              }}>
              Uplift
            </CustomText>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Icon name="search" color={colors.mainTextColor} size={30} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            renderItem={({item}) => <PostCard post={item} />}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{paddingBottom: 100}}
          />
        </View>
      )}
    </>
  );
};

export default HomeScreen;
