import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

const ForegroundNotification = ({ title, body, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0

  useEffect(() => {
    // Fade in the notification
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Automatically fade out after a few seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(onClose); // Call onClose after fade out completes
    }, 4000); // Show notification for 4 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [fadeAnim, onClose]);

  return (
    <Animated.View style={{ 
      position: 'absolute', 
      top: 50, // Adjust this value as needed
      left: 20,
      right: 20,
      backgroundColor: '#333', // Notification background color
      borderRadius: 8,
      padding: 16,
      zIndex: 1000,
      elevation: 5,
      opacity: fadeAnim // Apply animated opacity
    }}>
      <TouchableOpacity onPress={onClose} style={{ flexDirection: 'column' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{title}</Text>
        <Text style={{ fontSize: 14, color: '#fff' }}>{body}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ForegroundNotification;
