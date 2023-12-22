import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert, Image } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from '../context';
import storage from "@react-native-firebase/storage";

const ServiceDetail = ({ route }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const { serviceName, price, description, creator, serviceId } = route.params;
  const navigation = useNavigation();
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchServiceImage = async () => {
      try {
        const serviceSnapshot = await firestore().collection('services').doc(serviceName).get();
        const { imageName, description } = serviceSnapshot.data();
        console.log('Fetched Data:', serviceName, imageName, description);
        setImageName(imageName);
        // Get the download URL for the image
        if (imageName) {
          const imageRef = storage().ref('images').child(imageName);
          const downloadURL = await imageRef.getDownloadURL();
          setImageUrl(downloadURL);
        }
      } catch (error) {
        console.error('Error fetching service data: ', error);
      }
    };

    fetchServiceImage();
  }, [serviceName]);

  const navigateToEditServices = () => {
    navigation.navigate('EditServices', { serviceId, serviceName, price, description });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa dịch vụ này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await firestore().collection('services').doc(serviceName).delete();
              console.log('Service deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting service: ', error);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <ImageBackground source={require('../Image/Arcane.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon={() => <Icon name="arrow-left" size={24} color="#fff" />}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Chi tiết dịch vụ</Text>
          <IconButton icon={() => <Icon name="cog" size={24} color="#fff" />} onPress={handleDelete} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Tên dịch vụ: {serviceName}</Text>
          <Text style={styles.detailText}>Giá: {price}</Text>
          <Text style={styles.detailText}>Mô tả: {description || "..."}</Text>
          <Text style={styles.detailText}>Người tạo: {userLogin.name}</Text>
        </View>

        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
        {imageName && <Text style={styles.imageNameText}>{imageName}</Text>}

        <Button
          style={styles.button}
          labelStyle={styles.buttonText}
          mode="contained-tonal"
          onPress={navigateToEditServices}
        >
          Cập nhật dịch vụ
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
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
  detailsContainer: {
    padding: 16,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    color: "black",
  },
  button: {
    backgroundColor: '#3598db',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  imageNameText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
});

export default ServiceDetail;
