import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartScreen from './Cart';
import Customer from './Customer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCart } from '../context';
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [services, setServices] = useState([]);
  const { addToCart } = useCart();
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('services')
      .onSnapshot(async (querySnapshot) => {
        const data = [];

        for (const doc of querySnapshot.docs) {
          const serviceData = {
            id: doc.id,
            ...doc.data(),
          };

          const imagePath = serviceData.imageName;

          if (imagePath) {
            try {
              const url = await storage().ref('images').child(imagePath);
              const downloadURL = await url.getDownloadURL();
              serviceData.imageName = downloadURL;
            } catch (error) {
              console.error('Error downloading image:', error);
              serviceData.imageName = null;
            }
          } else {
            serviceData.imageName = null;
          }

          data.push(serviceData);
        }

        setServices(data);
      });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = async (item) => {
    try {
      // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
      if (cart.findIndex((cartItem) => cartItem.id === item.id) !== -1) return;
  
      // Thêm sản phẩm vào giỏ hàng cục bộ
      const updatedCart = [...cart, { ...item, amount: 1 }];
      setCart(updatedCart);
      addToCart(item);
  
      // Lấy thông tin người dùng hiện tại
      const user = auth().currentUser;
      if (!user) {
        console.error('User not logged in');
        return;
      }
      const userId = user.uid;
  
      // Thêm sản phẩm vào Firestore
      await firestore()
        .collection('Cart')
        .add({
          userId: userId,
          productId: item.id,
          productName: item.serviceName,
          productPrice: item.price,
          productImage: item.imageName,
          amount: 1, // Bạn có thể thay đổi giá trị này nếu cần
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
  
      console.log('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceItemContainer}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => navigation.navigate('product', { serviceId: item.id })}
      >
        {item.imageName ? (
          <Image source={{ uri: item.imageName }} style={styles.serviceImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </TouchableOpacity>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode='tail'>
          {item.serviceName}
        </Text>
        <Text style={styles.servicePrice}>{item.price} VND</Text>
      </View>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => handleAddToCart(item)}
      >
        <Ionicons name="cart-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const HomeScreenContent = ({ services, renderServiceItem }) => (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: "https://bizweb.dktcdn.net/100/383/022/themes/827617/assets/slider_1.jpg?1646288400190" }}
          style={styles.bannerImage}
        />
        <View style={styles.categoryContainer}>
          {[
            { uri: "https://image.tienphong.vn/w890/Uploaded/2023/rwbvhvobvvimsb/2021_10_07/20190614-114413-121485-thit-do-max-800x800-6027.png", label: "Thịt" },
            { uri: "https://tiki.vn/blog/wp-content/uploads/2023/10/trai-cay-giau-canxi.jpg", label: "Trái cây" },
            { uri: "https://static.kinhtedothi.vn/images/upload/2022/08/19/rau-cu-qua.jpg", label: "Rau củ" },
            { uri: "https://cdn5.vectorstock.com/i/1000x1000/37/34/hot-sale-vector-3643734.jpg", label: "Giảm giá" },
            { uri: "https://cdn.tgdd.vn/2021/06/CookProductThumb/BeFunky-collage(1)-620x620-3.jpg", label: "Dụng cụ" },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Image source={{ uri: item.uri }} style={styles.categoryImage} />
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.overlay}>
        <FlatList
          data={formatData(services, 2)}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderServiceItem}
        />
      </View>
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = 'cart-outline';
          } else if (route.name === 'User') {
            iconName = 'key-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" options={{ headerShown: false }}>
        {() => <HomeScreenContent services={services} renderServiceItem={renderServiceItem} />}
      </Tab.Screen>
      <Tab.Screen name='Cart' options={{ headerShown: false }}>
        {() => <CartScreen />}
      </Tab.Screen>
      <Tab.Screen name="User" component={Customer} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bannerContainer: {
    backgroundColor: '#3598db',
    height: 200,
    width: '100%',
    flex: 3.5,
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  categoryContainer: {
    backgroundColor: 'white',
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    padding: 10,
    alignContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  categoryImage: {
    height: 50,
    width: 50,
  },
  categoryLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  overlay: {
    flex: 5,
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { height: 10, width: 10 },
  },
  serviceItemContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 10,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#C0C0C0',
  },
  serviceInfo: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    width: '100%',
    overflow: 'hidden', // Giúp đảm bảo văn bản không tràn ra ngoài
  },
  servicePrice: {
    fontSize: 16,
    color: '#FF6F61',
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#65b31d',
    borderRadius: 25,
    padding: 12,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
