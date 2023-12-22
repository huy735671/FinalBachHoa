import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const AddUserScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const handleAddUser = async () => {
    try {
      // Step 1: Create user in Firebase Authentication
      const credential = await auth().createUserWithEmailAndPassword(email, password);

      // Step 2: Add user details to Firestore
      await firestore().collection('USERS').doc(credential.user.uid).set({
        name,
        phone,
        address,
        email,
        role,
      });

      // Optionally, you can navigate back to the user list screen
      navigation.navigate('ManageUsers');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Thêm người dùng</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Picker
          style={styles.input}
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Admin" value="Admin" />
          <Picker.Item label="Customer" value="Customer" />
        </Picker>
      </View>
      <Button title="Thêm người dùng" onPress={handleAddUser} />
      
      <Button title="Quay lại" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
});

export default AddUserScreen;
