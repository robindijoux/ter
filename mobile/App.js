import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import SheetCreation from "./SheetCreation";
import StudentSpace from "./StudentSpace";
import Attendance from "./Attendance";
import { RootSiblingParent } from 'react-native-root-siblings'
<<<<<<< Updated upstream
import { HeaderBackButton } from '@react-navigation/elements';
import {Button} from "react-native";
=======
>>>>>>> Stashed changes

const Stack = createNativeStackNavigator();
export default function App() {
  return (
  <RootSiblingParent>
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
<<<<<<< Updated upstream
            <Stack.Screen name="SheetCreation" component={SheetCreation} options={{
                headerTitle: "SheetCreation",
                headerTitleAlign: "center",
                headerBackVisible: false,
            }}/>
            <Stack.Screen name="StudentSpace" component={StudentSpace} />
              <Stack.Screen name="Attendance" component={Attendance} options={{
                  headerTitle: "Attendance",
                  headerTitleAlign: "center",
                  headerBackVisible: false,
              }}/>
=======
            <Stack.Screen name="SheetCreation" component={SheetCreation} />
            <Stack.Screen name="StudentSpace" component={StudentSpace} />
            <Stack.Screen name="Attendance" component={Attendance} />
>>>>>>> Stashed changes
          </Stack.Navigator>
      </NavigationContainer>
  </RootSiblingParent>
  );
}
