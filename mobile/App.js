import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Login";
import SheetCreation from "./SheetCreation";
import StudentSpace from "./StudentSpace";

const Stack = createNativeStackNavigator();
export const baseUrl = 'https://15a2-37-66-146-127.eu.ngrok.io';
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SheetCreation" component={SheetCreation} />
                <Stack.Screen name="StudentSpace" component={StudentSpace} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
