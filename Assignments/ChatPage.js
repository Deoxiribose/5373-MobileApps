import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Read the user's token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in AsyncStorage');
      }

      // Fetch user's last name using the token
      const responseLastName = await fetch('http://137.184.227.11:8085/profile/last_name', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!responseLastName.ok) {
        console.error('What is your last name?    :', responseLastName.status);
        setShowNameModal(true); // Show the modal for entering the user's name
        return;
      }

      const lastNameData = await responseLastName.json();
      if (!lastNameData.last_name) {
        setShowNameModal(true); // Show the modal for entering the user's name
        return;
      }

      setLastName(lastNameData.last_name);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateUserProfile = async (token, lastName) => {
    try {
      // Update user's profile data using a PUT request for last name
      const responseLastName = await fetch('http://137.184.227.11:8085/profile/last_name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ last_name: lastName }),
      });

      if (!responseLastName.ok) {
        throw new Error('Failed to update user last name');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleNameSave = async () => {
    // Save the last name to AsyncStorage
    await AsyncStorage.setItem('lastName', lastName);
    setShowNameModal(false);
  };

  const handleSendMessage = () => {
    // Generate a fake message
    const fakeMessage = `${lastName}: ${newMessage}`;
    setMessages([...messages, fakeMessage]);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <Modal visible={showNameModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter your last name:</Text>
          <TextInput
            style={styles.modalInput}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />
          <Button title="Save" onPress={handleNameSave} />
        </View>
      </Modal>
      <View style={styles.chatContainer}>
        <View style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <Text key={index} style={styles.message}>{message}</Text>
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
          />
          <Button title="Send" onPress={handleSendMessage} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default ChatPage;