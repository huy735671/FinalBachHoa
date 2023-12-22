import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { MyContextControllerProvider } from "./src/context";
import Router from "./src/screens/Router";
import { NavigationContainer } from "@react-navigation/native";

const initial = async () => {
  try {
    // Your Firebase Firestore collection for users
    const USERS = firestore().collection('USERS');

    const admin = {
      name: 'Huy',
      phone: '1234123124123',
      address: 'Phu Yen',
      email: 'huy85667@gmail.com',
      password: '123456',
      role: 'admin',
    };

    // Check if the admin user exists
    const userDoc = USERS.doc(admin.email);
    const userSnapshot = await userDoc.get();

    if (!userSnapshot.exists) {
      // Create the admin user and set initial data
      await auth().createUserWithEmailAndPassword(admin.email, admin.password);
      await userDoc.set(admin);
      console.log("Add new user admin!");
    }

    // Create a cart for the user
    const userCartRef = firestore().collection('carts').doc(admin.email);
    const userCartSnapshot = await userCartRef.get();

    if (!userCartSnapshot.exists) {
      await userCartRef.set({ items: [] });
      console.log("Cart created for user:", admin.email);
    }
  } catch (error) {
    console.error("Error during initial setup:", error);
  }
};

const Appp = () => {
  useEffect(() => {
    initial();
  }, []);

  return (
    <MyContextControllerProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </MyContextControllerProvider>
  );
};

export default Appp;
