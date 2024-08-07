import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useMyContextController, login } from "../context";


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('quybui072@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [controller, dispatch] = useMyContextController();
  const { userLogin, error } = controller;

  useEffect(() => {
 
    console.log("error:", error);
  
    if (userLogin != null) {
      console.log("User role:", userLogin.role);
     

      const email=userLogin.email
      if (userLogin.role === "admin") {
        navigation.navigate("Home");
      } else {
        navigation.navigate('HomeScreen',{email});
      }
    } else {
      // Do something else, maybe show a loading indicator or default behavior
    }
  }, [userLogin, error]);

  const onSubmit = () => {
    login(dispatch, email, password);
  };

  return (
    <ImageBackground
      source={require('../Image/Arcane.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng nhập</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            label="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            label="Password"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            right={
              <TextInput.Icon
                name={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <Button
            mode="contained"
            onPress={onSubmit}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Đăng nhập
          </Button>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => navigation.navigate('SignUp')}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
            >
              Đăng ký
            </Button>
            <Button
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
            >
              Quên tài khoản
            </Button>
          </View>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  form: {
    marginTop: 20,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: '#3498db',
  },
  buttonLabel: {
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#3598db',
  },
  secondaryButtonLabel: {
    fontSize: 16,
    color: 'white',
  },
});

export default Login;
