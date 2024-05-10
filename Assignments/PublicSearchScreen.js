import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const PublicSearchScreen = () => {
  const [randomCandies, setRandomCandies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Use the useNavigation hook

  // Function to fetch random candies from the server
  const fetchRandomCandies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://137.184.227.11:8082/candies/random');
      if (!response.ok) {
        throw new Error('Failed to fetch random candies');
      }
      const data = await response.json();
      setRandomCandies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching random candies:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch random candies initially
    fetchRandomCandies();

    // Set interval to fetch random candies every 5 seconds
    const intervalId = setInterval(() => {
      fetchRandomCandies();
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleCandyPress = async (candy) => {
    // Handle candy press action here
  };

  // Function to handle back button press
  const handleBack = () => {
    navigation.navigate('Landing'); // Navigate back to the landing page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Our Stock</Text>
      <View style={styles.contentContainer}>
        {randomCandies.length > 0 ? (
          <FlatList
            data={[randomCandies.slice(0, 2), randomCandies.slice(2, 4)]} // Divide randomCandies into two arrays, each containing two candies
            renderItem={({ item }) => (
              <View style={styles.rowContainer}>
                {item.map(candy => (
                  <TouchableOpacity key={candy.id} onPress={() => handleCandyPress(candy)} style={styles.candyItem}>
                    <Image source={{ uri: candy.img_url }} style={styles.candyImage} />
                    <Text style={styles.candyName}>{candy.name}</Text>
                    <Text style={styles.candyPrice}>{`Price: $${candy.price}`}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.candyList}
          />
        ) : (
          <ActivityIndicator style={styles.loadingIndicator} />
        )}
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500', // Orange background
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 150,
    marginTop: 20,
    color: '#FFFFFF', // White text color
  },
  contentContainer: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  candyItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  candyImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  candyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#FFFFFF', // White text color
    textAlign: 'center',
  },
  candyPrice: {
    fontSize: 14,
    color: '#FFFFFF', // White text color
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 10,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 50,
  },
  backButtonText: {
    color: '#FFA500', // Orange text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PublicSearchScreen;
