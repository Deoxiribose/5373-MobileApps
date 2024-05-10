import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SortingButton = ({ onPress, sortOrder }) => {
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons
          name={sortOrder === 'lowToHigh' ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={16}
          color="#FFA500"
        />
        <Text style={styles.label}>{sortOrder === 'lowToHigh' ? 'Low to High' : 'High to Low'}</Text>
      </TouchableOpacity>
    );
  };
  

const CandiesByCategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('lowToHigh'); // Initial sort order

  useEffect(() => {
    const fetchCandiesByCategory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://137.184.227.11:8082/candies/category/${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch candies');
        }
        const data = await response.json();
        setCandies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candies:', error);
        setLoading(false);
      }
    };

    fetchCandiesByCategory();
  }, [category]);

  const sortCandies = () => {
    // Toggle sort order
    const newSortOrder = sortOrder === 'lowToHigh' ? 'highToLow' : 'lowToHigh';
    setSortOrder(newSortOrder);
    // Sort candies based on price
    const sortedCandies = candies.sort((a, b) => {
      if (newSortOrder === 'lowToHigh') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    // Update state with sorted candies
    setCandies([...sortedCandies]);
  };

  const handleCandyPress = (candy) => {
    // Navigate to the CandyPage screen with the selected candy's data
    navigation.navigate('CandyPage', { searchData: candy });
  };

  const renderCandyItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCandyPress(item)}>
      <View style={styles.candyItem}>
        <Text style={styles.candyName}>{item.name}</Text>
        <Text style={styles.candyPrice}>{`Price: $${item.price}`}</Text>
        {/* Display small icon of the picture here */}
        <Image source={{ uri: item.img_url }} style={styles.candyImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SortingButton onPress={sortCandies} sortOrder={sortOrder} />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={candies}
          renderItem={renderCandyItem}
          keyExtractor={(item) => item._id}
          style={styles.candyList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  candyList: {
    width: '100%',
  },
  candyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  candyName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Ensure candy name takes remaining space
  },
  candyPrice: {
    fontSize: 16,
    marginRight: 10, // Add spacing between name and price
  },
  candyImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Round the corners to make it circular
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FFA500',
  },
});

export default CandiesByCategoryScreen;
