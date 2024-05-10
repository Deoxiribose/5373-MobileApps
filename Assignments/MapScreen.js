import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const INITIAL_REGION = {
  latitude: 34.0963202,
  longitude: -98.5896099,
  latitudeDelta: 2,
  longitudeDelta: 2
};

export default function MapScreen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState(null);
  const [userLocations, setUserLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  // Define fetchOtherUserLocations outside useEffect
  const fetchOtherUserLocations = async () => {
    try {
      const response = await fetch('http://137.184.227.11:8085/user_locations');
      if (!response.ok) {
        throw new Error('Failed to fetch other user locations. Server returned status: ' + response.status);
      }
      const data = await response.json();
      setUserLocations(data);
    } catch (error) {
      console.error('Error fetching other user locations:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in AsyncStorage');
        }

        const response = await fetch('http://137.184.227.11:8085/profile/first_name', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Who are you? : ' + response.status);
          setModalVisible(true); // Show the modal for entering the user's name
        } else {
          const data = await response.json();
          if (!data.first_name) {
            setModalVisible(true); // Show the modal for entering the user's name
          } else {
            setName(data.first_name);
            await fetchUserLocation();
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        let { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
        await fetchOtherUserLocations();
      } catch (error) {
        console.error('Error fetching user location:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleNameChange = (text) => {
    setNewName(text);
  };

  const handleSaveName = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in AsyncStorage');
      }

      const response = await fetch('http://137.184.227.11:8085/profile/first_name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ first_name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user name. Server returned status: ' + response.status);
      }

      setName(newName);
      setModalVisible(false);
      await fetchOtherUserLocations(); // Fetch user locations again after updating name
    } catch (error) {
      console.error('Error updating user name:', error.message);
    }
  };

  const renderUserMarkers = () => {
    return userLocations.map((user, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: user.latitude,
          longitude: user.longitude,
        }}
        title={user.first_name} // Assuming the user's name is stored in the 'name' field
        pinColor="blue"
      >
        <Callout>
          <Text>{user.first_name}</Text>
          {/* You can add more information about the user here */}
        </Callout>
      </Marker>
    ));
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Enter your name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleNameChange}
              value={newName}
            />
            <Button
              title="Save"
              onPress={handleSaveName}
            />
          </View>
        </View>
      </Modal>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        provider={PROVIDER_GOOGLE}
      >
        {renderUserMarkers()}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={name}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});
