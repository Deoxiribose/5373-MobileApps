import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, FlatList, ActivityIndicator } from 'react-native';
import OtherCandyItem from './OtherCandyItem'; // Import the OtherCandyItem component

const CandyPage = ({ route, navigation }) => {
  const { searchData } = route.params;
  const [showDescription, setShowDescription] = useState(false);
  const [otherCandies, setOtherCandies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSearchData, setCurrentSearchData] = useState(searchData); // State variable to hold searchData

  // Function to fetch other candies from the server
  const fetchOtherCandies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://137.184.227.11:8082/candies/random');
      if (!response.ok) {
        throw new Error('Failed to fetch other candies');
      }
      const data = await response.json();
      setOtherCandies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching other candies:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtherCandies();
  }, []);

  const handleWhereToBuy = () => {
    if (currentSearchData.prod_url) {
      Linking.openURL(currentSearchData.prod_url);
    } else {
      console.error('Product URL is not available.');
    }
  };

  const handleCandyPress = async (candy) => {
    try {
      let response;
      if (candy._id) {
        // If candy has _id, fetch candy details using /candies/{candy_id} endpoint
        response = await fetch(`http://137.184.227.11:8082/candies/${candy._id}`);
      } else if (candy.id) {
        // If candy has id, fetch candy details using /candies/by_id/{candy_id} endpoint
        response = await fetch(`http://137.184.227.11:8082/candies/by_id/${candy.id}`);
      } else {
        throw new Error('Invalid candy data');
      }
  
      if (!response.ok) {
        throw new Error('Failed to fetch candy details');
      }
      const updatedCandy = await response.json();
      // Update the currentSearchData state variable with the fetched candy details
      setCurrentSearchData(updatedCandy);
      // Refetch other candies
      fetchOtherCandies();
    } catch (error) {
      console.error('Error fetching candy details:', error);
      Alert.alert('Failed to fetch candy details. Please try again later.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.candyContainer}>
          <Image source={{ uri: currentSearchData.img_url }} style={styles.candyImage} />
          <Text style={styles.candyName}>{currentSearchData.name}</Text>
          <Text style={styles.candyPrice}>{`Price: $${currentSearchData.price}`}</Text>
          <TouchableOpacity onPress={() => setShowDescription(!showDescription)} style={styles.descriptionButton}>
            <Text style={styles.descriptionButtonText}>{showDescription ? 'Hide Description' : 'Show Description'}</Text>
          </TouchableOpacity>
          {showDescription && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.candyDesc}>{currentSearchData.desc}</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleWhereToBuy} style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Where to Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.otherCandiesContainer}>
        <Text style={styles.otherCandiesHeading}>Other Candies</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={otherCandies}
            horizontal
            renderItem={({ item }) => <OtherCandyItem candy={item} onPress={handleCandyPress} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.otherCandiesList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  candyContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
  candyPrice: {
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  candyDesc: {
    fontSize: 14,
  },
  buyButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otherCandiesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  otherCandiesHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  otherCandiesList: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default CandyPage;
