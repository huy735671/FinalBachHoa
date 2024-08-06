import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useMyContextController } from '../context';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HoaDon = () => {
  const [controller, dispatch] = useMyContextController();
  const { cart } = controller;
  const navigation = useNavigation();

  // Tính tổng số tiền từ giỏ hàng
  const totalAmount = cart.reduce((total, item) => total + parseFloat(item.price), 0);

  const renderCartItem = ({ item, index }) => (
    <View style={styles.cartItem}>
      {/* {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )} */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemNumber}>{index + 1}.</Text>
        <Text style={styles.itemName}>{item.serviceName}</Text>
        <Text style={styles.itemPrice}>{item.price} VND</Text>
      </View>
    </View>
  );

  const handleRemoveFromCart = (itemId) => {
    // Cập nhật giỏ hàng: gọi hàm dispatch với action REMOVE_FROM_CART
    dispatch({ type: 'REMOVE_FROM_CART', value: itemId });
  };

  const handleIncreaseQuantity = (itemId) => {
    // Cập nhật giỏ hàng: gọi hàm dispatch với action INCREASE_QUANTITY
    dispatch({ type: 'INCREASE_QUANTITY', value: itemId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hóa Đơn</Text>
      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
          <Button mode="contained" onPress={() => navigation.navigate('HomeScreen')} style={styles.button}>
            Quay lại trang chủ
          </Button>
        </View>
      ) : (
        <View style={styles.cartContainer}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
          />
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng cộng:</Text>
              <Text style={styles.summaryValue}>{totalAmount} VND</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Số lượng sản phẩm:</Text>
              <Text style={styles.summaryValue}>{cart.length}</Text>
            </View>
            <Text style={styles.thankYouText}>Cảm ơn vì đã mua hàng</Text>
            <Button mode="contained" onPress={() => navigation.navigate('HomeScreen')} style={styles.button}>
              Quay lại trang chủ
            </Button>
          </View>
        </View>
      )}
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
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  cartContainer: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  itemNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  itemDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    flex: 1,
  },
  itemPrice: {
    fontSize: 18,
    color: '#2ecc71',
    textAlign: 'right',
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
