import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import SheetCreation from "./SheetCreation";
import StudentSpace from "./StudentSpace";
import Attendance from "./Attendance";
import { RootSiblingParent } from 'react-native-root-siblings'
import { HeaderBackButton } from '@react-navigation/elements';
import {Button} from "react-native";


const Stack = createNativeStackNavigator();
export default function App() {
  return (
  <RootSiblingParent>
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SheetCreation" component={SheetCreation} options={{
                headerTitle: "Attendance",
                headerTitleAlign: "center",
                headerBackVisible: false,
            }}/>
            <Stack.Screen name="StudentSpace" component={StudentSpace} />
              <Stack.Screen name="Attendance" component={Attendance} options={{
                  headerTitle: "Attendance",
                  headerTitleAlign: "center",
                  headerBackVisible: false,
              }}/>
          </Stack.Navigator>
      </NavigationContainer>
  </RootSiblingParent>
  );
}
