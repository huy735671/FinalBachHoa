import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCart } from '../context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartScreen from './Cart';
import { IconButton } from 'react-native-paper';  // Thêm import
import {useMyContextController} from '../context';
import storage from '@react-native-firebase/storage';
import Customer from './Customer';
const Tab = createBottomTabNavigator();

const HomeScreen = (route) => {
  const [services, setServices] = useState([]);
  const { addToCart } = useCart();
  const navigation = useNavigation();
  const [cart,setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const {params}=useRoute();
  // const CART = firestore().collection('cart');
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
          }
        }
        data.push(serviceData);
      }

      setServices(data);
    });
  return () => unsubscribe();
}, []);
  const AdddCart= async (services)=>{
    try{

      const collectionRef = firestore().collection('carts');
      const documentData = {
        imageName:services.imageName,
        email:params,
        price:services.price,
  
      };
      await collectionRef.add(documentData);
      console.log('Document added successfully!');
     
    }catch(error)
    {
      console.error('Error adding document: ', error);
    }
  

  }


  const handleAddToCart = (item) => {
    if (cart.findIndex((cartItem) => cartItem.id === item.id) !== -1) return null;
    const updatedCart = [...cart, { ...item, amount: 1 }];
    setCart(updatedCart);
    addToCart(item);
  };
  const formatData = (data,numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  
    return data;
  };

  const renderServiceItem = ({ item }) => (
    <View style={{flex:1,borderWidth:1,width:100,height:250,borderRadius:10,alignItems:"center",justifyContent:"center",paddingLeft:15}}>
      <View style={{flex:1.3,width:170,backgroundColor:"",height:100,padding:10}}>
      {item.imageName ? (
        <Image source={{ uri: item.imageName }} style={styles.placeholderImage} />
      ) : (
        <View style={styles.placeholderImage}/> 
      )}
       <View style={styles.serviceItem}>
        <Text style={styles.serviceName}>Tên: {item.serviceName}</Text>
        <Text style={styles.servicePrice}>Giá: {item.price} VND</Text>
      </View>
      <View style={{flex:1.8,height:50,width:150,justifyContent:"center",alignItems:"center" ,backgroundColor:"white"}}>
      <TouchableOpacity
         style={{width:150,justifyContent:"center"}}
         onPress={() => navigation.navigate('product', { serviceId: item.id })}
        >
     
      <View style={styles.viewButton} >
        {/* Thay đổi nút thành icon giỏ hàng */}
        <IconButton
          icon="cart-outline"
          color="white"
          size={20}
          onPress={() =>addToCart(item)}

       />
          <Text style={{fontSize:20} } >Xem </Text>
        
   
      </View>
    </TouchableOpacity>
      </View>
   
      </View>
      
    </View>
  
  );

  const HomeScreenContent = ({services, renderServiceItem ,ImageTab}) => (
   
   <View style={styles.container}>
        <View style={{backgroundColor:"#3598db",height:200,width:600,flex:3.5}}>
       <Image source={{uri:"https://bizweb.dktcdn.net/100/383/022/themes/827617/assets/slider_1.jpg?1646288400190"}} style={{width:600,height:200}}/>
       <View style={{backgroundColor:"white",height:100,width:600,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
          <TouchableOpacity style={styles.Touchec_css}>
                  <Image source={{uri:"https://image.tienphong.vn/w890/Uploaded/2023/rwbvhvobvvimsb/2021_10_07/20190614-114413-121485-thit-do-max-800x800-6027.png"}} style={{height:50,width:50}}/>
                 <Text>Thịt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Touchec_css}>
                  <Image source={{uri:"https://tiki.vn/blog/wp-content/uploads/2023/10/trai-cay-giau-canxi.jpg"}} style={{height:50,width:50}}/>
                 <Text>Trái cây</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Touchec_css}>
                  <Image source={{uri:"https://static.kinhtedothi.vn/images/upload/2022/08/19/rau-cu-qua.jpg"}} style={{height:50,width:50}}/>
                 <Text>Rau củ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Touchec_css}>
                  <Image source={{uri:"https://cdn5.vectorstock.com/i/1000x1000/37/34/hot-sale-vector-3643734.jpg"}} style={{height:50,width:50}}/>
                 <Text>Giảm giá</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Touchec_css}>
                  <Image source={{uri:"https://cdn.tgdd.vn/2021/06/CookProductThumb/BeFunky-collage(1)-620x620-3.jpg"}} style={{height:50,width:50}}/>
                 <Text>Dụng cụ</Text>
          </TouchableOpacity>
       </View>
      
        </View>
        <View style={styles.overlay}>
          <FlatList
            data={formatData(services,2)}
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
          }else if(route.name==='User')
          {
            iconName = 'key-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" options={{headerShown:false}}>
        {() => <HomeScreenContent services={services} renderServiceItem={renderServiceItem}  />}
      </Tab.Screen>
      <Tab.Screen name='Cart' options={{headerShown:false}}>
        {() => <CartScreen services={services} renderServiceItem={renderServiceItem} />}
      </Tab.Screen >
      <Tab.Screen name="User" component={Customer} options={{headerShown:false}}/>
    </Tab.Navigator>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
    justifyContent:"center",
    alignItems:"center"
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 5,
    backgroundColor: 'white',
    width:400,
    padding:10,
    shadowColor:"black",
    shadowOpacity:1,
    shadowOffset:{height:10,width:10},
    


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  serviceItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    width: 170,
    paddingVertical: 10,

  
  },
  serviceImage: {
    width: 170,
    height: 30,
    borderRadius: 15,
   

   
  },
  placeholderImage: {
    width: 150,
    height: 110,
    backgroundColor: '#C0C0C0',
    borderRadius: 15,
  },
  serviceItem: {
    flex: 2,
    marginLeft: 10,

    height:130,
    width:150,
    marginTop:10,
    marginRight:30,
  
    

  },
  serviceName: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  servicePrice: {
    color: 'red',
    fontSize: 18,
  },
  viewButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection:"row",
    alignItems:"center"
  },
  viewButtonText: {
    flex:1,
    color: 'white',
    fontWeight: 'bold',
    flexDirection:"row",
    
   
  },
  Touchec_css:{
    padding:15,
    alignContent:"center",
    alignItems:"center",
  }
})

export default HomeScreen;
