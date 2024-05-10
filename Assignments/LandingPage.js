import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';

export default function HomePage({ navigation }) {
  const [showWelcomePage, setShowWelcomePage] = useState(false);
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const titleLoop = Animated.loop(
      Animated.timing(titleAnimation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const buttonLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnimation, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimation, {
          toValue: 0,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    titleLoop.start();
    buttonLoop.start();

    const timer = setTimeout(() => {
      setShowWelcomePage(true);
    }, 3000);

    return () => {
      titleLoop.stop();
      buttonLoop.stop();
      clearTimeout(timer);
    };
  }, []);

  const titleOpacity = titleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  const titleScale = titleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const buttonScale = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handlePublicCandy = () => {
    navigation.navigate('PublicSearch');
  };

  if (showWelcomePage) {
    return (
      <View style={[styles.container, { backgroundColor: '#FFD700' }]}>
        <Text style={styles.welcomeText}>Welcome to PhotoCandy!</Text>
        <Text style={styles.subText}>Satisfy your sweet tooth with our delightful treats!</Text>
        <TouchableOpacity
          style={[styles.button, { transform: [{ scale: buttonScale }] }]}
          onPress={handleCreateAccount}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { transform: [{ scale: buttonScale }] }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { transform: [{ scale: buttonScale }] }]}
          onPress={handlePublicCandy}
        >
          <Text style={styles.buttonText}>Candy?</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.title, { opacity: titleOpacity, transform: [{ scale: titleScale }] }]}
      >
        PhotoCandy
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'orange',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 100,
  },
  subText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});
