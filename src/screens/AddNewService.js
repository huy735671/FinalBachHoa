import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ImageBackground, ScrollView, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import { IconButton, Text } from 'react-native-paper';
import storage from '@react-native-firebase/storage';

const AddNewService = ({ navigation }) => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageSource, setImageSource] = useState(null);

  const SERVICES = firestore().collection('services');

  const uploadImageToFirebase = async (localImagePath, imageName) => {
    try {
      const reference = storage().ref(`images/${imageName}`);
      await reference.putFile(localImagePath);
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  };

  const addNewService = async () => {
    try {
      if (!serviceName || !price || !imageSource || !description) {
        Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin dịch vụ và chọn hình ảnh.');
        return;
      }

      const formattedPrice = `${price} ₫`;

      const serviceDoc = SERVICES.doc(serviceName);

      await serviceDoc.set({
        serviceName,
        description,
        price,
        imageName,
      });

      const downloadURL = await uploadImageToFirebase(imageSource.uri, imageName);

      Alert.alert('Thông báo', 'Dịch vụ đã được thêm thành công.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
      console.log('Đã thêm');
    } catch (error) {
      console.error('Error adding service: ', error);
    }
  };

  const selectedImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      const filePath = image.path;
      const parts = filePath.split('/');
      const imageName = parts[parts.length - 1];

      console.log('Image Info:', image);
      setImageSource({ uri: image.path });
      setImageName(imageName);

    }).catch((error) => {
      console.log('Lỗi Hình ảnh: ', error);
    });
  };

  return (
    <ImageBackground
      source={require('../Image/Arcane.jpg')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            color="#fff"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Thêm dịch vụ</Text>
          <IconButton icon="cog" color="#fff" size={24} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Tên dịch vụ"
          value={serviceName}
          onChangeText={(text) => setServiceName(text)}
        />

        <TextInput
          style={styles.descriptionInput}
          placeholder="Mô tả"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline={true}
        />

        <TextInput
          style={styles.input}
          placeholder="Giá"
          value={price}
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        />

        <View>
          <Image source={imageSource ? imageSource : require("../Image/Arcane.jpg")} style={{ width: 370, height: 250 }} />
          <Text style={{ fontSize: 15, color: 'gray', marginTop: 5 }}>{imageName}</Text>
          <TouchableOpacity onPress={selectedImage}>
            <Button title='Thêm hình ảnh' onPress={selectedImage} />
          </TouchableOpacity>
        </View>

        <Button title="Thêm mới dịch vụ" onPress={addNewService} />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3598db',
    height: 50,
    padding: 10,
    marginBottom: 20,
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  input: {
    borderColor: 'violet',
    borderWidth: 1,
    height: 50,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  descriptionInput: {
    borderColor: 'violet',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'violet',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default AddNewService;
