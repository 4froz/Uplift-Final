import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';

// Get screen width
const { width: screenWidth } = Dimensions.get('window');

const AutoHeightImage = ({ source, style }) => {
  const [imageHeight, setImageHeight] = useState(0);
  
  // Use Image.getSize to get the image dimensions
  useEffect(() => {
    if (source.uri) {
      Image.getSize(source.uri, (width, height) => {
        const aspectRatio = width / height;
        setImageHeight(screenWidth / aspectRatio); // Calculate height based on screen width
      }, (error) => {
        console.error('Error loading image:', error);
      });
    }
  }, [source.uri]);

  return (
    <View style={styles.container}>
      {imageHeight > 0 && ( // Render image only if height is calculated
        <Image
          source={{ uri: source.uri }}
          style={[styles.image, { height: imageHeight }, style]} // Apply the calculated height
          resizeMode="cover" // Or adjust according to your preference
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Full width
  },
  image: {
    width: '100%', // Full width
  },
});

export default AutoHeightImage;
