import React, {useState,useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

import { useMyContextController } from '../context';


const Service = ({ navigation}) => {
  const [controller,dispatch] = useMyContextController();
  const {userLogin}= controller;
  useEffect(()=>{
    if(userLogin == null){
      navigation.navigate("Login");
    }
  },[userLogin])
}

export default Service;

