import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ImageBackground, Button, ActivityIndicator } from 'react-native';
import { List, Text, IconButton } from 'react-native-paper';
import { useMyContextController } from '../context';
import firestore from '@react-native-firebase/firestore';

const Home = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const servicesSnapshot = await firestore().collection('services').get();
      const servicesData = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServiceList(servicesData);
    } catch (error) {
      console.error('Error fetching services: ', error);
      setError('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLogin == null) {
      fetchData();
      navigation.navigate('Login');
    } else {
      fetchData();
    }
  }, [userLogin, navigation]);

  const handleAdmin = () => {
    navigation.navigate('Admin');
  };

  

  const navigateToServiceDetail = service => {
    navigation.navigate('ServiceDetail', {
      serviceName: service.serviceName,
      price: service.price,
      creator: service.creator,
      time: service.time,
      final: service.final,
    });
  };

  return (
    <ImageBackground
      source={require('../Image/Arcane.jpg')} 
      style={styles.background}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {userLogin != null && "Quản lý bách hóa"}
          </Text>
          
        </View>
        <View style={styles.listContainer}>
          <View style={styles.listHeaderContainer}>
            <Text style={styles.listHeaderText}>Danh Sách sản phẩm</Text>
            <IconButton
              icon="plus"
              size={40}
              iconColor="white"
              onPress={() => navigation.navigate('AddNewService')}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="violet" style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={serviceList}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={`Tên dịch vụ: ${item.serviceName}`}
                  description={`Giá: ${item.price}`}
                  onPress={() => navigateToServiceDetail(item)}
                  style={styles.listItem}
                />
              )}
            />
          )}
        </View>
        <Button title="Thông tin Admin" onPress={handleAdmin} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  headerContainer: {
    backgroundColor: 'transparent',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 20,
    borderRadius: 10,
    padding: 10,
  },
  listHeaderContainer: {
    height: 50,
    backgroundColor: '#3598db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  listHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'violet',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(70, 0, 0, 0.1)',
    borderRadius: 5,
  },
});

export default Home;
