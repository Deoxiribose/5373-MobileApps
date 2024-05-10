import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './MapScreen'; // Import the MapScreen component
import SearchScreen from './SearchScreen'; // Import the SearchScreen component
import ChatPage from './ChatPage'; // Import the ChatPage component


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeContent}
      options={{ headerShown: false }} // Hide the header for the Home screen
    />
  </Stack.Navigator>
);

export default function HomeScreen() {
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Map" component={MapScreen} />
      <Drawer.Screen name="Search" component={SearchScreen} />
      <Drawer.Screen name="ChatPage" component={ChatPage} />
    </Drawer.Navigator>
  );
}

function HomeContent() {
  const bounceValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.spring(
      bounceValue,
      {
        toValue: 1,
        friction: 2,
        tension: 60,
        useNativeDriver: true,
      }
    ).start();
  }, [bounceValue]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.welcomeText, { transform: [{ scale: bounceValue }] }]}>
        Thank you for signing up for PhotoCandy!
      </Animated.Text>
      <Text style={styles.featureText}>Check out some of the features:</Text>
      <Text style={styles.featureText}>- Maps</Text>
      <Text style={styles.featureText}>- Search</Text>
      <Text style={styles.featureText}>- Chat</Text>
    </View>
  );
}

const CustomDrawerContent = (props) => {
  const { navigation } = props;
  const [buttonPressCount, setButtonPressCount] = useState(0);
  const buttonPressTimeoutRef = useRef(null);

  const handleLogout = () => {
    // Navigate to the login screen
    navigation.navigate('Login');
  };

  const handleSpecialButtonPress = () => {
    clearTimeout(buttonPressTimeoutRef.current);
    setButtonPressCount((prevCount) => prevCount + 1);

    buttonPressTimeoutRef.current = setTimeout(() => {
      setButtonPressCount(0);
    }, 5000); // Reset button press count after 5 seconds

    if (buttonPressCount === 6) {
      // Navigate to the UploadPage when the button is pressed 7 times
      navigation.navigate('Upload');
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={handleLogout} style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSpecialButtonPress} style={styles.specialButton}>
        <Text style={styles.specialButtonText}>JB</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500', // Orange background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF', // White text color
  },
  featureText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFFFFF', // White text color
  },
  drawerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFA500', // Orange background color
    borderRadius: 5, // Optional: Add border radius for rounded corners
  },
  drawerItemText: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
  },
  specialButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#89CFF0', // Orange background color
    borderRadius: 5
  },
  specialButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
