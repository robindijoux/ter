import React, {useEffect, useState} from 'react';
import {Button, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import axios from 'axios';
import {BASE_URL} from "./global";
export default function StudentSpace({ route, navigation }){
    let [sheets, setSheets] = useState([]);

    const studentData = route.params.userData;
    const currentTime = new Date().getTime();
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
            alert("Feuille signée !");
            getSheets().then(() => console.log("Sheets reloaded"));
        } catch (error) {
            console.log("Not signed: ", error);
        }
    }

    //todo: must be replace by the server's isAttendanceOngoing attribute
    const isAttendanceOngoing = (sheet) => {
        return (sheet.courseStartDate < currentTime && currentTime < sheet.courseEndDate);
    }

    //todo: must be replace by the server's isAttendanceGoing attribute
    const isAttendanceEnded = (sheet) => {
        return (currentTime > sheet.courseEndDate);
    }

    const isSigned = (sheet) => {
        if(sheet.signatures[studentData.id].signature === "signValue") {
            return true;
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feuille de séance en cours</Text>
            {sheets.filter(sheet => isAttendanceOngoing(sheet)).map((sheet) => (
                <Sheet key={sheet.id} sheet={sheet} sign={signSheet} isSigned={isSigned}></Sheet>
            ))}
            <Text style={styles.title}>Historique des feuilles signées</Text>
            {sheets.filter(sheet => isAttendanceEnded(sheet)).map((sheet) => (
                <EndedSheet key={sheet.id} sheet={sheet} isSigned={isSigned}></EndedSheet>
            ))}
        </View>
    );
}

const Sheet = ({sheet, sign, isSigned}) => {
    const startDate = new Date(sheet.courseStartDate);
    const endDate = new Date(sheet.courseEndDate);

    return (
        <View style={styles.sheet}>
            <Text style={styles.subtitle}>{sheet.courseLabel}</Text>
            <Text>Date du cours : {startDate.getDate()}/{startDate.getMonth()}/{startDate.getFullYear()}</Text>
            <Text>Heure du cours : {startDate.getHours()}:{startDate.getMinutes()} - {endDate.getHours()}:{endDate.getMinutes()}</Text>
            {isSigned(sheet)?
                (<Text style={styles.signed}>Feuille signée</Text>) :
                (<Button title={"Signer la feuille"} onPress={() => {sign(sheet.id);}}></Button>)
            }
        </View>
    );
}

const EndedSheet = ({sheet, isSigned}) => {
    const startDate = new Date(sheet.courseStartDate);
    const endDate = new Date(sheet.courseEndDate);
    return (
        <View style={styles.sheet}>
            <Text style={styles.subtitle}>{sheet.courseLabel}</Text>
            <Text>Date du cours : {startDate.getDate()}/{startDate.getMonth()}/{startDate.getFullYear()}</Text>
            <Text>Heure du cours : {startDate.getHours()}:{startDate.getMinutes()} - {endDate.getHours()}:{endDate.getMinutes()}</Text>
            {isSigned(sheet)?(<Text style={styles.signed}>Feuille signée</Text>):null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
        padding: 5,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    title: {
        fontSize: 20,
        backgroundColor: '#1380ff',
        color: 'white',
        paddingHorizontal: 5,
        paddingVertical: 2,
        margin: 10,
    },
    subtitle: {
        fontSize: 20,
        marginTop: 10,
    },
    sheet: {
        backgroundColor: 'white',
        padding: 2,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    signed: {
        color: 'white',
        backgroundColor: 'green',
        paddingHorizontal: 10,
        marginTop: 10,
    }
});
