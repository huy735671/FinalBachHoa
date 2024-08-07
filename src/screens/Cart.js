import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const CartScreen = ({ route }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Định dạng số tiền với dấu phân cách hàng nghìn
  const formatCurrency = (amount) => {
    if (isNaN(amount)) return '0 VND';
    return amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
  };

  // Tính tổng số tiền từ giỏ hàng
  const totalAmount = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || 0; // Chuyển đổi giá trị thành số hoặc 0 nếu không hợp lệ
    console.log('Item price:', price); // Debugging
    return total + price;
  }, 0);

  // Định dạng tổng số tiền
  const formattedTotalAmount = formatCurrency(totalAmount);

  // Hàm để lấy dữ liệu giỏ hàng từ Firestore
  const fetchCartData = () => {
    const user = auth().currentUser;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const userId = user.uid;

    return firestore()
      .collection('Cart')
      .where('userId', '==', userId)
      .onSnapshot((snapshot) => {
        const cartData = snapshot.docs.map(doc => doc.data());
        console.log('Cart data:', cartData); // Debugging
        setCart(cartData);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching cart data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const unsubscribe = fetchCartData();
    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={item.productImage ? { uri: item.productImage } : require('../Image/iconCart.png')} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.productName}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.productPrice)}</Text>
      </View>
      <View style={styles.quantityButtonContainer}>
        <TouchableOpacity
          style={styles.quantityButton} 
          onPress={() => handleIncreaseQuantity(item.productId)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromCart(item.productId)}
      >
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  const handleRemoveFromCart = (itemId) => {
    console.log('Removing item with id:', itemId); // Debugging
    // Xử lý xóa sản phẩm
  };

  const handleIncreaseQuantity = (itemId) => {
    // Xử lý tăng số lượng sản phẩm
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Giỏ Hàng</Text>
      </View>
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.emptyCartText}>Đang tải...</Text>
        ) : cart.length === 0 ? (
          <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            renderItem={renderCartItem}
          />
        )}
      </View>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng cộng:</Text>
          <Text style={styles.summaryValue}>{formattedTotalAmount}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Số lượng sản phẩm:</Text>
          <Text style={styles.summaryValue}>{cart.length}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate("HoaDon")}>
          <Button onPress={() => navigation.navigate("HoaDon")}>
            <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    width: '100%',
    paddingVertical: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#2ecc71',
  },
  quantityButtonContainer: {
    marginLeft: 10,
  },
  quantityButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 5,
    padding: 8,
  },
  quantityButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 8,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyCartText: {
    fontSize: 18,
    color: 'gray',
  },
  summaryContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'flex-start',
    borderWidth: 5,
    borderColor: '#ddd',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
  },
  checkoutButton: {
    backgroundColor: '#3598db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CartScreen;
