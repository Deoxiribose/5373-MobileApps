import * as React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CategoriesScreen = () => {
  const navigation = useNavigation();

  // List of categories
  const categories = [
    "Sugar Free Candy", "Jelly Beans", "Candy Toys", "Caramel Candy", "Wax Candy",
    "Mini Sized Candy", "Candy Scoops Display Containers", "King Size Theater Boxes",
    "Licorice Candy", "Foil Wrapped Chocolate Candy", "Novelty Candy", "Old Fashioned Candy",
    "Nuts Seeds", "Hot Spicy Candy", "Mints Peppermint Candy", "Jawbreakers Candy", "Candy Bars",
    "Powder Candy", "Rock Candy", "Salt Water Taffy"
  ];

  const handleCategoryPress = (category) => {
    // Perform navigation to a screen showing candies for the selected category
    navigation.navigate('CandiesByCategoryScreen', { category });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCategoryPress(item)}>
      <View style={styles.categoryItem}>
        <Text>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        style={styles.categoryList}
      />
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
  categoryList: {
    width: '100%',
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CategoriesScreen;
