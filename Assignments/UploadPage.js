import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadPage = ({ navigation }) => {
  const [photoNames, setPhotoNames] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  

  useEffect(() => {
    const fetchPhotosInterval = setInterval(fetchPhotoNames, 10000); // Fetch photos every 10 seconds
    return () => clearInterval(fetchPhotosInterval); // Clean up the interval on unmount
  }, []);

  useEffect(() => {
    fetchPhotoNames();
  }, []);

  const fetchPhotoNames = async () => {
    try {
      const response = await fetch('http://137.184.227.11:8085/photos');
      const data = await response.json();
      setPhotoNames(data);
    } catch (error) {
      console.error('Error fetching photo names:', error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [photoNames]);

  const fetchPhotos = async () => {
    try {
      const promises = photoNames.map(async (photoName) => {
        const response = await fetch(`http://137.184.227.11:8085/photos/${photoName}`);
        const blob = await response.blob();
        const base64Data = await blobToBase64(blob);
        return { name: photoName, uri: `data:image/jpeg;base64,${base64Data}` };
      });
      const resolvedPhotos = await Promise.all(promises);
      setPhotos(resolvedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const blobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleChoosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
  
      console.log('ImagePicker result:', result);
  
      if (!result.cancelled && result.assets.length > 0 && result.assets[0].uri) {
        const selectedImageUri = result.assets[0].uri;
        setSelectedImage(selectedImageUri);
        await AsyncStorage.setItem('selectedImageUri', selectedImageUri); // Save selected image URI to AsyncStorage
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedImage) {
        console.warn('No image selected');
        return;
      }

      const formData = new FormData();
      // Extract the file extension from the selected image URI
      const fileExtension = selectedImage.split('.').pop();
      // Generate a custom filename using the current timestamp
      const filename = `image_${Date.now()}.${fileExtension}`;
      formData.append('file', {
        uri: selectedImage,
        name: filename,
        type: 'image/jpeg', // Adjust the type if needed
      });

      const response = await fetch('http://137.184.227.11:8085/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status code ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Upload response:', responseData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}></TouchableOpacity>
      <FlatList
        horizontal
        data={photos}
        renderItem={({ item }) => <Image source={{ uri: item.uri }} style={styles.image} />}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.photoList}
      />
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
  <Text style={styles.buttonText}>Back</Text>
</TouchableOpacity>
      <TouchableOpacity
        style={[styles.uploadButton, !selectedImage && styles.disabledButton]}
        onPress={handleUpload}
        disabled={!selectedImage}
      >
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500', // Orange background color
  },
   backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    marginTop: 20,
    backgroundColor: '#FFA500', // Orange button background color
    padding: 10,
    borderRadius: 5,
  },
  photoList: {
    alignItems: 'center', // Center photos horizontally
    paddingVertical: 10,
  },
  image: {
    width: 300, // Larger width
    height: 300, // Larger height
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#FFA500', // Orange button background color
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: '#FFA500', // Orange button background color
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default UploadPage;
