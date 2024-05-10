import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CreateAccountScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnimation = new Animated.Value(1);
  const navigation = useNavigation();

  useEffect(() => {
    if (showLogo) {
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => setShowLogo(false));
    } else {
      setShowLogo(true);
    }
  }, [showLogo]);

  const handleCreateAccount = async () => {
    // Validate the form
    if (!email || !password || !confirmPassword) {
      Alert.alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    // Send a POST request to register the user
    setIsLoading(true);
    try {
      const response = await fetch('http://137.184.227.11:8085/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to register user');
      }
      Alert.alert('Account created successfully');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Animated.Text style={[styles.logo, { opacity: fadeAnimation }]}>
        {showLogo ? 'PhotoCandy' : 'JB'}
      </Animated.Text>
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
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>
      <TouchableOpacity
        style={styles.createAccountBtn}
        onPress={handleCreateAccount}
        disabled={isLoading}>
        <Text style={styles.createAccountText}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
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
  backButton: {
    position: 'absolute',
    top: 40, // Adjust the top margin here
    left: 20,
    zIndex: 1,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#ff9900',
    marginBottom: 50,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  inputText: {
    height: 50,
    color: '#333333',
  },
  createAccountBtn: {
    width: '80%',
    backgroundColor: '#ff9900',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
