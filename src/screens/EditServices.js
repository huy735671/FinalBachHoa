
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const EditServiceScreen = ({ route, navigation }) => {
  const { serviceName, initialServiceName, initialPrice } = route.params;
  const [serviceName1, setServiceName1] = useState(initialServiceName);
  const [price, setPrice] = useState(initialPrice);
  const [error, setError] = useState(null);
  const [isDataReady, setIsDataReady] = useState(true); // Set giá trị mặc định là true để hiển thị người dùng ngay lập tức
  // const [description,setDescription] = useState(initialDesciption);
  // Không cần sử dụng useEffect để fetch dữ liệu, bạn đã có dữ liệu từ route.params

  const confirmUpdate = async () => {
    try {
      if (!isDataReady) {
        setError('Service data is not ready. Please wait a moment and try again.');
        return;
      }

      await firestore().collection('services').doc(serviceName).update({
        serviceName: serviceName1,
        price: price,
        // description: description,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error updating service: ', error);
      setError('Failed to update service. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../Image/Arcane.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Cập nhật dịch vụ</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Service Name"
            value={serviceName1}
            onChangeText={(text) => setServiceName1(text)}
            placeholderTextColor="#fff"
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price} 
            onChangeText={(text) => setPrice(text)}
            keyboardType="numeric"
            placeholderTextColor="#fff"
          />
           {/* <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholderTextColor="#fff"
          /> */}
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={confirmUpdate}>
          <Text style={styles.updateButtonText}>Cập nhật</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackButtonText}>Trở lại</Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: '#fff',
    borderWidth: 1,
    height: 50,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  updateButton: {
    backgroundColor: '#3598db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  goBackButton: {
    backgroundColor: '#3598db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EditServiceScreen;
