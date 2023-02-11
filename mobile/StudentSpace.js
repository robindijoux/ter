import React, {useEffect, useState} from 'react';
import {Button, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import axios from 'axios';
import {BASE_URL} from "./global";
export default function StudentSpace({ route, navigation }){
    let [sheets, setSheets] = useState([]);

    const studentData = route.params.userData;
    const getSheets = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/sheet?studentId=${studentData.id}`);
            console.log(response.data);
            setSheets(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
            getSheets().then(() => console.log("Sheets loaded"));
        }
        , []);
    const signSheet = async (sheetId) => {
        console.log("Signing sheet n°" + sheetId);
        try {
            const response = await axios.post(`${BASE_URL}/signature`, {
                "personId": studentData.id,
                "sheetId": sheetId,
                "signature": "signValue"
            });
            console.log(response.data);
        } catch (error) {
            console.log("Not signed: ", error);
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feuilles de présence disponible</Text>
            {sheets.map((sheet) => (
                <Sheet key={sheet.id} sheet={sheet} sign={signSheet}></Sheet>
            ))}
        </View>
    );
}

const Sheet = ({sheet, sign}) => {
    const startDate = new Date(sheet.courseStartDate);
    const endDate = new Date(sheet.courseEndDate);
    return (
        <View style={styles.sheet}>
            <Text style={styles.title}>{sheet.courseLabel}</Text>
            <Text>Date du cours : {startDate.getDate()}/{startDate.getMonth()}/{startDate.getFullYear()}</Text>
            <Text>Heure du cours : {startDate.getHours()}:{startDate.getMinutes()} - {endDate.getHours()}:{endDate.getMinutes()}</Text>
            <Button title={"Signer la feuille"} onPress={() => {
                sign(sheet.id);
            }}></Button>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    title: {
        fontSize: 20,
    },
    sheet: {
        backgroundColor: 'white',
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    }
});
