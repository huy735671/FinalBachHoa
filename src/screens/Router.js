import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMyContextController } from '../context';
import Admin from '../screens/Admin';
import Customer from './Customer';
import Login from './Login';
import Home from './Home';
import ServiceDetail from './ServiceDetail';
import AddNewService from './AddNewService';
import EditServiceScreen from './EditServices';

import SignUp from './SignUp';
import ForgotPasswordScreen from './ForgotPassword';
import HomeScreen from './TCKH';
import CartScreen from './Cart';
import ProductDetail from './ProductDetailScreen';
import ManageUsersScreen from './ManageUsersScreen';
import AddUserScreen from './AddUserScreen';

import HoaDon from "./HoaDon";




const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Router = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    if (!userLogin && navigation) {
      navigation.navigate('Login');
    }
  }, [userLogin, navigation]);

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Customer" component={Customer} options={{headerShown:false}} />
      <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
      <Stack.Screen name='SignUp' component={SignUp}/>
      <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen}/>
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name='Cart' component={CartScreen} options={{headerShown:false}} />
      <Stack.Screen name="AddNewService" component={AddNewService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown:false}} />
      <Stack.Screen name='product' component={ProductDetail}/>
      <Tab.Screen name="ManageUsers" component={ManageUsersScreen} />
      <Stack.Screen name='AddUser' component={AddUserScreen}/>
      <Stack.Screen name='HoaDon' component={HoaDon}/>
      <Stack.Screen 
  name="EditServices"
  component={EditServiceScreen}
  options={{
    headerStyle: { backgroundColor: 'pink' },
  }}
/>
    </Stack.Navigator>
    



    
  );
  
};

export default Router;
