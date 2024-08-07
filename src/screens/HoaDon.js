import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HoaDon = () => {
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

  const handleCompleteOrder = () => {
    const user = auth().currentUser;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const userId = user.uid;

    // Xóa giỏ hàng từ Firestore
    firestore()
      .collection('Cart')
      .where('userId', '==', userId)
      .get()
      .then(snapshot => {
        const batch = firestore().batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        return batch.commit();
      })
      .then(() => {
        navigation.navigate('HomeScreen');
      })
      .catch((error) => {
        console.error('Error clearing cart:', error);
      });
  };

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
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hóa Đơn</Text>
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
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng cộng:</Text>
          <Text style={styles.summaryValue}>{formattedTotalAmount}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Số lượng sản phẩm:</Text>
          <Text style={styles.summaryValue}>{cart.length}</Text>
        </View>
        <Text style={styles.thankYouText}>Cảm ơn vì đã mua hàng</Text>
        <Button mode="contained" onPress={handleCompleteOrder} style={styles.button}>
          Hoàn Thành
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  summaryContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 16,
  },
  thankYouText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default HoaDon;
