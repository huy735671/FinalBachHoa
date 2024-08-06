import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductDetail = ({ route }) => {
  const [service, setService] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigation = useNavigation();
  const { serviceId } = route.params;

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceSnapshot = await firestore()
          .collection('services')
          .doc(serviceId)
          .get();

        if (serviceSnapshot.exists) {
          const data = {
            id: serviceSnapshot.id,
            ...serviceSnapshot.data(),
          };
          setService(data);

          const { imageName } = data;
          if (imageName) {
            const imageRef = storage().ref('images').child(imageName);
            const downloadURL = await imageRef.getDownloadURL();
            setImageUrl(downloadURL);
          }
        } else {
          console.warn('Service not found');
        }
      } catch (error) {
        console.error('Error fetching service: ', error);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleAddToCart = async () => {
    try {
      const collectionRef = firestore().collection('carts');
      const documentData = {
        imageName: service.imageName,
        price: service.price,
        serviceName: service.serviceName
      };
      await collectionRef.add(documentData);
      console.log('Document added successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../Image/Arcane.jpg')}
        style={styles.background}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={30} color={"white"} />
          </TouchableOpacity>
          <Text style={styles.profileText}>Chi tiết sản phẩm</Text>
        </View>

        <View style={styles.productContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage} />
          )}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{service.serviceName}</Text>
            <Text style={styles.productPrice}>
              Giá: {`${service.price} VND`}
            </Text>
            <View style={styles.separator} />
            <View style={styles.descriptionContainer}>
              <Text style={styles.productDescription}>
                Mô tả: {service.description}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.addToCartButton]}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
    flex: 1,
    textAlign: 'center',
  },
  productContainer: {
    flex: 1, 
    alignItems: 'center',
    paddingVertical: 20,
  },
  productImage: {
    width: '95%',
    height: 250,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 10,
  },
  placeholderImage: {
    width: '80%',
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 10,
  },
  productDetails: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 20,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1, 
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 10,
  },
  productPrice: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    marginLeft: 10,
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  descriptionContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    minHeight: 310,
  },
  productDescription: {
    fontSize: 18,
    color: 'black',
  },
  footer: {
    padding: 15,
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    width: '100%',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



export default ProductDetail;
