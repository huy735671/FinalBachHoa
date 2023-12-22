import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useMyContextController, logout } from '../context';

const Admin = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const handleLogout = () => {
    logout(dispatch);
    navigation.navigate('Login');
  };

  const handleManageUsers = () => {
    navigation.navigate('ManageUsers');
  };

  const handleChangeInfo = () => {
    // Implement the logic to navigate to the change info screen
  };

  return (
    <ImageBackground
      source={require('../Image/Arcane.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Quản lý Admin</Text>
        </View>

        {userLogin ? (
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoText}>Admin: {userLogin.name.toUpperCase()}</Text>
            <Text style={styles.userInfoText}>Phone: {userLogin.phone}</Text>
            <Text style={styles.userInfoText}>Address: {userLogin.address}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.manageUsersButton}
                onPress={handleManageUsers}
              >
                <Text style={styles.buttonText}>Quản lý Người Dùng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeInfoButton}
                onPress={handleChangeInfo}
              >
                <Text style={styles.buttonText}>Thay đổi thông tin</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noInfoContainer}>
            <Text style={styles.text}>No user information available</Text>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
          </View>
        )}
        <Button title="Trở lại" onPress={() => navigation.goBack()} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  manageUsersButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  changeInfoButton: {
    flex: 1,
    backgroundColor: '#3598db',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Admin;
