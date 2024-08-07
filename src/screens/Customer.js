import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import { useMyContextController, logout } from '../context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const Customer = () => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [avatar, setAvatar] = useState(userLogin?.avatarUrl || ''); // Store avatar URL
  const navigation = useNavigation();
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleLogout = () => {
    logout(dispatch);
    navigation.navigate('Login');
  };

  const handleChangePassword = () => {
    // Add logic to navigate to the change password screen
    // navigation.navigate('ChangePasswordScreen');
  };

  // Khởi chạy thư viện ảnh
  const pickImage = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 800,
      maxHeight: 600,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets) {
        console.log('Image picked: ', response.assets[0].uri);
        setAvatar(response.assets[0].uri); // Cập nhật avatar
      }
    });
  };

  // Khởi chạy máy ảnh
  const openCamera = () => {
    launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 800,
      maxHeight: 600,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets) {
        console.log('Image captured: ', response.assets[0].uri);
        setAvatar(response.assets[0].uri); // Cập nhật avatar
      }
    });
  };

  // Function to mask password
  const maskPassword = (password) => {
    if (password) {
      return '*'.repeat(password.length);
    }
    return ''; // Hoặc một giá trị mặc định khác
  };
  return (
    <View style={style.View_Main}>
      <ImageBackground source={require('../Image/JHYTI.jpg')} style={style.Background}>
        <View style={style.View_1}>
          <View style={{ flex: 2, marginTop: 10 }}>
            <Image
              source={avatar ? { uri: avatar } : require('../Image/anhnen.png')}
              style={{ width: 200, height: 200, marginBottom: 10, borderRadius: 80 }}
            />
            <TouchableOpacity style={style.Button} onPress={pickImage}>
              <Text style={style.ButtonText}>Cập Nhật Avatar</Text>
            </TouchableOpacity>
          </View>

          <View style={style.View_2}>
            <Text style={style.Text}>Chào bạn {userLogin?.name}</Text>

            {/* Logout and Change Password Buttons */}
            <View style={style.ButtonContainer}>
              <TouchableOpacity style={style.Button} onPress={handleLogout}>
                <Text style={style.ButtonText}>Đăng Xuất</Text>
              </TouchableOpacity>

              <TouchableOpacity style={style.Button} onPress={handleChangePassword}>
                <Text style={style.ButtonText}>Đổi Mật Khẩu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* User Information with White Background */}
        <View style={style.UserInfoContainer}>
          <View style={style.WhiteBackground}>
            <Text style={style.UserInfoText}>Họ và Tên: {userLogin?.name}</Text>
            <Text style={style.UserInfoText}>Số điện thoại: {userLogin?.phone}</Text>
            <Text style={style.UserInfoText}>Email: {userLogin?.email}</Text>
            <Text style={style.UserInfoText}>Mật khẩu: {maskPassword(userLogin?.password)}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// Your styles here
const style = StyleSheet.create({
  View_Main: {
    flex: 1,
  },
  Background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  View_1: {
    width: '95%',
    height: 350,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  Text: {
    color: 'black',
    textShadowOffset: { height: 0, width: 0.9 },
    textShadowColor: 'black',
    fontSize: 20,
    fontFamily: 'sans-serif-medium',
    fontStyle: 'italic',
  },
  View_2: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  Button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5, // Adjust the spacing between buttons
  },
  ButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  UserInfoContainer: {
    marginTop: 20,
    width: '95%',
  },
  WhiteBackground: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  UserInfoText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Customer;
