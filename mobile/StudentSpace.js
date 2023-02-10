import React, {useEffect, useState} from 'react';
import {Button, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StatusBar} from "expo-status-bar";
import axios from 'axios';
import {baseUrl} from "./App";
// const baseUrl = 'https://server-aph4.onrender.com';

export default function StudentSpace({ route, navigation }){
    let [data, setData] = useState([]);

    const studentData = route.params.userData;
    const getSheets = async () => {
        try {
            const response = await axios.get(`${baseUrl}/sheet?studentId=${studentData.id}`);//TODO: change the studentId to the one of the connected user
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
            getSheets().then(() => console.log("Call to getSheets done"));
        }
        , []);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student space</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
    },
});
