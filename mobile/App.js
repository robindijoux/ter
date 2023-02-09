import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Login";
import SheetCreation from "./SheetCreation";

const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SheetCreation" component={SheetCreation} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
