import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigation = useNavigation();

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`http://137.184.227.11:8082/autocomplete?query=${searchQuery}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Please enter a candy!');
      return;
    }

    try {
      const response = await fetch(`http://137.184.227.11:8082/candies/name/${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const searchData = await response.json();
      console.log('Search Data:', searchData);
      navigation.navigate('CandyPage', { searchData });
    } catch (error) {
      console.error('Error fetching search results:', error);
      Alert.alert('Failed to fetch search results. Please try again later.');
    }
  };

  const handleSuggestionPress = (item) => {
    setSearchQuery(item);
  };

  const handleNavigateToCategories = () => {
    navigation.navigate('CategoriesScreen');
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
      <View style={styles.suggestionItem}>
        <Text>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Searchbar
          placeholder="Please enter a candy!"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={handleSearch} // Change to onIconPress to handle the search action
          style={styles.searchBar}
        />
        <TouchableOpacity style={styles.categoriesButton} onPress={handleNavigateToCategories}>
          <Text>Categories</Text>
        </TouchableOpacity>
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          renderItem={renderSuggestionItem}
          keyExtractor={(item) => item}
          style={styles.suggestionsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBarContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
  },
  categoriesButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  suggestionsList: {
    marginTop: 10,
    width: '100%',
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SearchScreen;
