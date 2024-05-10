import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './LandingPage.js';
import PublicSearchScreen from './PublicSearchScreen';
import PublicCandy from './PublicCandy';
import LoginScreen from './LoginScreen';
import CreateAccountScreen from './CreateAccountScreen';
import HomeScreen from './HomeScreen';
import UploadPage from './UploadPage';
import MapScreen from './MapScreen'; 
import SearchScreen from './SearchScreen';
import CandyPage from './CandyPage';
import CandyDetailPage from './CandyDetail'; // Assuming you have a CandyDetailPage component
import CategoriesScreen from './CategoriesScreen';
import CandiesByCategoryScreen from './CandiesByCategoryScreen'; // Import the CandiesByCategoryScreen component
import ChatPage from './ChatPage';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Landing" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="PublicSearch" component={PublicSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PublicCandy" component={PublicCandy} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Upload" component={UploadPage} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CandyPage" component={CandyPage} options={{ headerShown: true, title: 'Candy Page' }} />
        <Stack.Screen name="CandyDetail" component={CandyDetailPage} options={{ headerShown: false, title: 'Candy Detail' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} options={{ headerShown: true, title: 'Categories' }} />
        <Stack.Screen name="CandiesByCategoryScreen" component={CandiesByCategoryScreen} options={{ headerShown: true, title: 'Candies By Category' }} />
        <Stack.Screen name="ChatPage" component={ChatPage} options={{ headerShown: false, title: 'Chat Page' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
