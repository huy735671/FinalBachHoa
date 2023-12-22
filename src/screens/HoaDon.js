import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useMyContextController } from '../context';
import {Button} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
const HoaDon = () => {
  const [controller, dispatch] = useMyContextController();
  const { cart } = controller;
  const navigation = useNavigation();

  // Tính tổng số tiền từ giỏ hàng
  const totalAmount = cart.reduce((total, item) => total + parseFloat(item.price), 0);

  const renderCartItem = ({ item,index }) => (
    <View style={styles.cartItem}>
      {/* {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )} */}
      <View style={styles.itemDetails}>
      <Text style={styles.itemNumber}>{index + 1}.</Text>
      
      <Text style={styles.itemName}>{item.serviceName}</Text>
      <View style={{flexDirection:'row',marginLeft:180,}}>
        <Text style={styles.itemPrice}>{item.price} VND</Text>
      </View>
       
      </View>
      <View style={styles.quantityButtonContainer}>
        {/* <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleIncreaseQuantity(item.id)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity> */}
      </View>
      {/* <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromCart(item.id)}
      >
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity> */}
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
        <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
        />
      )}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng cộng:</Text>
          <Text style={styles.summaryValue}>{totalAmount} VND</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Số lượng sản phẩm:</Text>
          <Text style={styles.summaryValue}>{cart.length}</Text>
        </View>
        {/* <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
        </TouchableOpacity> */}
        <Text style={{fontSize:25, fontWeight:'bold'}}>Cảm ơn vì đã mua hàng</Text>
        <Button onPress={()=>navigation.navigate('HomeScreen')}>Quay lại trang chủ</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  itemNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8, // Khoảng cách giữa số thứ tự và tên sản phẩm
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
    flexDirection:'row',
    
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8, // Khoảng cách giữa số thứ tự và tên sản phẩm
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
    // marginTop: 20,
    width: '100%',
    alignItems: 'flex-end',
   
    marginRight:100,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '80%',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: '#3598db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HoaDon;
