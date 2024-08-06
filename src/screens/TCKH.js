import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { IconButton } from 'react-native-paper';
import CartScreen from './Cart';
import Customer from './Customer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [services, setServices] = useState([]);
  const { addToCart } = useCart();
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { params } = useRoute();

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
            // Tải hình ảnh từ Firebase Storage
            try {
              const url = await storage().ref('images').child(imagePath);
              const downloadURL = await url.getDownloadURL();
              serviceData.imageName = downloadURL; // Thêm đường dẫn hình ảnh vào dữ liệu service
            } catch (error) {
              console.error('Error downloading image:', error);
              serviceData.imageName = null; // Nếu có lỗi, đặt imageName thành null
            }
          } else {
            serviceData.imageName = null; // Đặt imageName thành null nếu không có
          }

          data.push(serviceData);
        }

        setServices(data);
      });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = (item) => {
    if (cart.findIndex((cartItem) => cartItem.id === item.id) !== -1) return null;
    const updatedCart = [...cart, { ...item, amount: 1 }];
    setCart(updatedCart);
    addToCart(item);
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
      <View style={styles.imageContainer}>
        {item.imageName ? (
          <Image source={{ uri: item.imageName }} style={styles.serviceImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>Tên: {item.serviceName}</Text>
        <Text style={styles.servicePrice}>Giá: {item.price} VND</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('product', { serviceId: item.id })}
        >
          <View style={styles.viewButton}>
            <IconButton
              icon="cart-outline"
              color="white"
              size={20}
              onPress={() => handleAddToCart(item)}
            />
            <Text style={styles.buttonText}>Xem</Text>
          </View>
        </TouchableOpacity>
      </View>
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
              <Text>{item.label}</Text>
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
        {() => <CartScreen services={services} renderServiceItem={renderServiceItem} />}
      </Tab.Screen>
      <Tab.Screen name="User" component={Customer} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 15,
    alignContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    height: 50,
    width: 50,
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
  },
  imageContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    backgroundColor: '#C0C0C0',
    borderRadius: 10,
  },
  serviceInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  servicePrice: {
    fontSize: 16,
    color: 'red',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
});

export default HomeScreen;
