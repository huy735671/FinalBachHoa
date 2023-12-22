import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

const ManageUsersScreen = ({ navigation }) => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [customerUsers, setCustomerUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adminSnapshot = await firestore()
          .collection('USERS')
          .where('role', '==', 'admin')
          .get();

        const customerSnapshot = await firestore()
          .collection('USERS')
          .where('role', '==', 'Customer')
          .get();

        const adminData = adminSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const customerData = customerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAdminUsers(adminData);
        setCustomerUsers(customerData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const confirmDeleteUser = (userId, role) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa người dùng này?',
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => handleDeleteUser(userId, role),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteUser = async (userId, role) => {
    try {
      await firestore().collection('USERS').doc(userId).delete();

      if (role === 'Admin') {
        setAdminUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else if (role === 'Customer') {
        setCustomerUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }

      Alert.alert('Xóa người dùng', 'Người dùng đã được xóa thành công.');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa người dùng.');
    }
  };

  const renderUserList = (users, role) => {
    return users.length > 0 ? (
      <View>
        <Text style={styles.roleHeaderText}>Danh sách {role}</Text>
        <Card containerStyle={styles.cardContainer}>
          {users.map((user, index) => (
            <ListItem key={index} bottomDivider>
              <Icon name="user" type="font-awesome" />
              <ListItem.Content>
                <ListItem.Title>{user.name}</ListItem.Title>
                <ListItem.Subtitle>{user.phone}</ListItem.Subtitle>
              </ListItem.Content>
              <Button
                icon={<Icon name="trash" type="font-awesome" color="white" />}
                buttonStyle={styles.deleteButton}
                onPress={() => confirmDeleteUser(user.id, role)}
              />
            </ListItem>
          ))}
        </Card>
      </View>
    ) : (
      <Text style={styles.noDataText}>Không có dữ liệu người dùng {role}.</Text>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Danh sách người dùng</Text>

      {/* Danh sách Admin */}
      {renderUserList(adminUsers, 'Admin')}

      {/* Danh sách khách hàng*/}
      {renderUserList(customerUsers, 'Customer')}

      <Button
        title="Thêm người dùng"
        onPress={() => navigation.navigate('AddUser')}
        buttonStyle={styles.addButton}
      />
      <Button
        title="Trở lại trang chủ"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {
    borderRadius: 10,
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  addButton: {
    backgroundColor: 'green',
    marginTop: 10,
  },
});

export default ManageUsersScreen;
