// Import necessary dependencies and components
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../context";
import Service from "../services";
import ServiceDetail from "./ServiceDetail";
import AddNewService from "./AddNewService";
import EditServices from "./EditServices"; 


const Stack = createStackNavigator();

const RouterServices = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Login");
    }
  }, [userLogin]);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Services"
        component={Service}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddNewService"
        component={AddNewService}
        options={{
          headerStyle: { backgroundColor: "pink" },
        }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetail}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "pink" },
        }}
      />
     <Stack.Screen
  name="EditServices"
  component={EditServices}
  options={{
    headerStyle: { backgroundColor: 'pink' },
  }}
/>

    </Stack.Navigator>
  );
};

export default RouterServices;
