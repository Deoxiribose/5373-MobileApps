import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const CandyDetail = ({ route }) => {
  const { candy } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: candy.img_url }} style={styles.candyImage} />
      <Text style={styles.candyName}>{candy.name}</Text>
      <Text style={styles.candyDesc}>{candy.desc}</Text>
      <Text style={styles.candyPrice}>{`Price: $${candy.price}`}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  candyImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  candyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  candyDesc: {
    fontSize: 16,
    marginBottom: 5,
  },
  candyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CandyDetail;
