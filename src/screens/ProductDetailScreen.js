import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {Button} from 'react-native-paper';
import {useMyContextController} from '../context';
import storage from '@react-native-firebase/storage';
const ProductDetail = ({route}) => {
  // const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const navigation = useNavigation();
  const [controller] = useMyContextController();
  const {userLogin} = controller;
  const {serviceName, price, description, creator, serviceId} = route.params;
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const CART = firestore().collection('cart');
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
          setService(data);}
        //   const imageName = serviceSnapshot.data().imageName;
        //   if (imageName) {
        //     const imageRef = storage().ref('images').child(imageName);
        //     const downloadURL = await imageRef.getDownloadURL();
        //     service.imageUrl = downloadURL; // Đặt URL hình ảnh trong trạng thái dịch vụ
        //   }
        // } else {
        //   console.warn('Service not found');
        // }
        const {imageName, description} = serviceSnapshot.data();
        console.log('Fetched Data:', serviceName, imageName, description);
        setImageName(imageName);
        // Get the download URL for the image
        if (imageName) {
          const imageRef = storage().ref('images').child(imageName);
          const downloadURL = await imageRef.getDownloadURL();
          setImageUrl(downloadURL);
        }
      } catch (error) {
        console.error('Error fetching service: ', error);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleAddToCart = async ({services}) => {
    // Thêm logic xử lý thêm vào giỏ hàng ở đây
    console.log('Đã thêm vào giỏ hàng:', service);
    try{

      const collectionRef = firestore().collection('carts');
      const documentData = {
        imageName:service.imageName,
        price:service.price,
        serviceName:service.serviceName
      };
      await collectionRef.add(documentData);
      console.log('Document added successfully!');
     

    }catch(error)
    {
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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <ImageBackground
        source={require('../Image/Arcane.jpg')}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chi tiết sản phẩm</Text>
          </View>
          <View style={styles.productDetailsContainer}>
  {imageUrl && (
    <Image source={{ uri: imageUrl }} style={styles.productImage} />
  )}
  <View style={styles.productDetails}>
  <Text style={styles.productName}>Tên: {service.serviceName}</Text>
  <Text style={styles.productPrice}>
    Giá: {`${service.price} VND`}
  </Text>
  <View style={styles.descriptionContainer}>
    <ScrollView>
      <Text style={styles.productDescription}>
        Mô tả: {service.description}
      </Text>
    </ScrollView>
  </View>
  <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={[styles.button, styles.addToCartButton]}
      onPress={handleAddToCart}
    >
      <Text style={styles.buttonText}>
        Thêm vào giỏ hàng
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, styles.goBackButton]}
      onPress={handleGoBack}
    >
      <Text style={styles.buttonText}>Quay lại</Text>
    </TouchableOpacity>
  </View>
</View>
</View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '90%',
    paddingVertical: 20,
  },
  productImage: {
    width: 380,
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 200,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
  },
  productDetails: {
    marginLeft: 20,
  },
  productName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,  // Giảm khoảng cách để chữ không nằm quá trái
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  productDescription: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
  },
  addToCartButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
  },
  goBackButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  goBackButtonText: {
    color: 'white',
    fontSize: 16,
  },

  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '90%',
    paddingVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addToCartButton: {
    backgroundColor: '#2ecc71',
    marginRight: 5,
  },
  goBackButton: {
    backgroundColor: '#3498db',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },


});

export default ProductDetail;
