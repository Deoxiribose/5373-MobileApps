import React, { useState, useRef, useEffect  } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigationRef = useRef(null);
  
  useEffect(() => {
    // Hide the header when this screen is rendered
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

const handleLogin = async () => {
  try {
    const response = await fetch('http://137.184.227.11:8085/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Authentication successful, extract and store the token
      const token = data.token;
      // Store the token locally (e.g., in AsyncStorage)
      await AsyncStorage.setItem('token', token);

      // Navigate to HomeScreen or any other authenticated screen
      navigation.navigate('Home');
    } else {
      // Authentication failed, display error message
      Alert.alert('Error', data.detail);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateToCreateAccount = () => {
    navigation.navigate('CreateAccount', { navigation: navigationRef.current });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PhotoCandy</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.passwordVisibilityToggle} onPress={togglePasswordVisibility}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#A9A9A9" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createAccountBtn} onPress={navigateToCreateAccount}>
        <Text style={styles.createAccountText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#ff9900',
    marginBottom: 50,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputText: {
    flex: 1,
    height: 50,
    color: '#333333',
  },
  passwordVisibilityToggle: {
    marginLeft: 10,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#ff9900',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
  createAccountBtn: {
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ff9900',
    borderWidth: 1,
    borderRadius: 25,
  },
  createAccountText: {
    color: '#ff9900',
    fontWeight: 'bold',
  },
});
