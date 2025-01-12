import React from 'react';
import { View, Image } from 'react-native';
import CustomText from '../../components/CustomText';
import { mainTextColor } from '../strings';
// Import other necessary components here (e.g., TouchableOpacity, Icon)

const ReactionCard = ({reactions}) => {
 
  const getCustomTimeFormat = (date) => {
    const time = new Date(date);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View>
      {reactions.map((r) => (
        <View
          key={r?.reaction}
          style={{
            flexDirection: 'column',
            width: '100%',
            padding: 20,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#202020',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: mainTextColor,
                  backgroundColor: '#404040',
                }}
                source={{
                  uri: r?.user?.profilePic ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBtcdqZTj-ODgzV8_UFL2Zi_tn_eoESQX0FDc3MLwLcg&s',
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                width: '84%',
                alignSelf: 'center',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomText
                  style={{
                    color: mainTextColor,
                    fontSize: 13,
                    fontFamily: 'GeneralSans-SemiBold',
                  }}>
                  {r?.user?.name}
                </CustomText>
              </View>
              <CustomText
                style={{
                  color: mainTextColor,
                  fontSize: 13,
                  fontFamily: 'GeneralSans-Medium',
                  marginVertical: 5,
                }}>
                {r?.reaction}
              </CustomText>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <CustomText
                  numberOfLines={1}
                  style={{
                    color: '#a6a6a6',
                    fontSize: 12,
                    fontFamily: 'GeneralSans-Regular',
                  }}>
                  {getCustomTimeFormat(r?.createdAt)}
                </CustomText>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ReactionCard;
