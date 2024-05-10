import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, FlatList, ActivityIndicator } from 'react-native';


// Import necessary modules

const PublicCandy = ({ route, navigation }) => {
    const { searchData } = route.params;
    const [showDescription, setShowDescription] = useState(false);
    const [otherCandies, setOtherCandies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSearchData, setCurrentSearchData] = useState(searchData);
  
    useEffect(() => {
      fetchOtherCandies();
    }, []);
  
    const fetchOtherCandies = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://137.184.227.11:8082/candies/random');
        if (!response.ok) {
          throw new Error('Failed to fetch other candies');
        }
        const data = await response.json();
        setOtherCandies(data);
      } catch (error) {
        console.error('Error fetching other candies:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleWhereToBuy = () => {
      if (currentSearchData.prod_url) {
        Linking.openURL(currentSearchData.prod_url);
      } else {
        console.error('Product URL is not available.');
      }
    };
  
    const handleCandyPress = async (candy) => {
      try {
        const response = await fetch(`http://137.184.227.11:8082/candies/${candy._id || candy.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch candy details');
        }
        const updatedCandy = await response.json();
        setCurrentSearchData(updatedCandy);
        fetchOtherCandies();
      } catch (error) {
        console.error('Error fetching candy details:', error);
      }
    };

    const handleGoBack = () => {
      navigation.goBack(); // Navigate back to the previous screen
    };
  
    return (
      <View style={styles.container}>
        {/* Your content here */}
        <TouchableOpacity onPress={handleGoBack}>
          <Text>Go Back</Text> {/* This is your back button */}
        </TouchableOpacity>
      </View>
    );
  };
  
  // Styles definition
  
  export default PublicCandy;
  