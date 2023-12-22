import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ImageBackground } from 'react-native';
import Auth from '../services/auth';
import firestore from '@react-native-firebase/firestore';


const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSignUp = async () => {
    try {
      await Auth.signUp(name, phone, email, password, address, 'Customer');
      console.log('User signed up successfully!');
      
      // Display success message
      alert('Đăng ký thành công!');
  
      // Navigate back to the login screen
      navigation.goBack();
    } catch (error) {
      console.error('Error signing up:', error.message);
      // Handle the error, e.g., show an error message to the user.
      alert('Đăng ký thất bại: ' + error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../Image/Arcane.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng Ký</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Nhập họ và tên'
            onChangeText={(text) => setName(text)}
            style={styles.textInput}
          />
          <TextInput
            placeholder='Nhập địa chỉ email'
            onChangeText={(text) => setEmail(text)}
            style={styles.textInput}
          />
          <TextInput
            placeholder='Nhập mật khẩu'
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            style={styles.textInput}
          />
          <TextInput
            placeholder='Nhập số điện thoại'
            onChangeText={(text) => setPhone(text)}
            style={styles.textInput}
          />
          <TextInput
            placeholder='Nhập địa chỉ'
            onChangeText={(text) => setAddress(text)}
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity onPress={handleSignUp}>
          <View style={styles.signUpButton}>
            <Text style={styles.buttonText}>Đăng Ký</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Quay lại trang đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#3498db',
  },
  inputContainer: {
    width: '80%',
    marginTop: 20,
  },
  textInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 18,
    color: '#333',
  },
  signUpButton: {
    backgroundColor: '#27ae60',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: 20,
    fontSize: 16,
    color: '#3498db',
  },
  goBackText: {
    marginTop: 20,
    fontSize: 16,
    color: '#3498db',
    textDecorationLine: 'underline', // Gạch chân dưới
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default SignUp;
