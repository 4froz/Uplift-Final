import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import axios from 'axios';
import CustomText from '../../components/CustomText';
import UserCard from '../../components/UserCard';
import {getColorsForTheme, server} from '../strings';

const ChatScreen = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contacts, setcontacts] = useState([]);
  const userInfo = useSelector(state => state.userInfo);
  const themeMode = useSelector(state => state.theme.themeMode);

  // Dynamically get the colors based on the current theme
  const colors = getColorsForTheme(themeMode);
  // Use useCallback to memoize the function and avoid re-creation on every render
  const getUserRequests = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true when the request starts
      const response = await axios.put(`${server}api/community`, {
        id: userInfo._id,
      });
      setcontacts(response.data);
      console.log(response.data);
      // Set the received data in state
    } catch (error) {
      console.error('Error fetching user requests:', error.mssg);
      setLoading(false); // Always set loading to false after the request is done
    } finally {
      setLoading(false); // Always set loading to false after the request is done
    }
  }, [userInfo._id]);

  // const getUserRequests = useCallback(async () => {
  //   try {
  //     setLoading(true); // Set loading to true when the request starts
  //     const response = await axios.get(
  //       `http://192.168.31.118:5000/api/user/request/${userInfo._id}`,
  //     );
  //     setUsers(response.data.requests); // Set the received data in state
  //   } catch (error) {
  //     console.error('Error fetching user requests:', error.message);
  //   } finally {
  //     setLoading(false); // Always set loading to false after the request is done
  //   }
  // }, [userInfo._id]);

  // Fetch user requests on component mount
  useEffect(() => {
    getUserRequests();
  }, [getUserRequests]);
  return (
    <>
      {loading ? (
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
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => getUserRequests()}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.appColor,
                paddingHorizontal: 16,
              }}>
              <CustomText
                bold
                style={{
                  fontSize: 16,
                  fontFamily: 'GeneralSans-SemiBold',
                  marginTop: 40,
                  marginBottom: 10,
                }}>
                Messages
              </CustomText>

              {contacts?.length > 0 && (
                <>
                  {contacts?.map(user => (
                    <UserCard
                      chatScreen
                      getRequests={getUserRequests}
                      key={
                        user.from == userInfo._id
                          ? user.to
                          : user.to == userInfo._id
                          ? user.from
                          : {}
                      }
                      user={user}
                    />
                  ))}
                </>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default ChatScreen;
