import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const OtherCandyItem = ({ candy, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(candy)}>
      <Image source={{ uri: candy.img_url }} style={styles.candyImage} />
      <View style={styles.textContainer}>
        <Text style={styles.candyName}>{candy.name}</Text>
        <Text style={styles.candyPrice}>{`Price: $${candy.price}`}</Text>
        {/* Add any other relevant information */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  candyImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  candyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  candyPrice: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Add styles for other information if needed
});

export default OtherCandyItem;
