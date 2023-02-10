import React, {useEffect, useState} from 'react';
import {Button, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StatusBar} from "expo-status-bar";
import axios from 'axios';
// const baseUrl = 'https://server-aph4.onrender.com';
const baseUrl = 'https://15a2-37-66-146-127.eu.ngrok.io';


export default function StudentSpace({ navigation }){
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
