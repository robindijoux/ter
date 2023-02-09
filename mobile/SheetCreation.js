import React, {useEffect, useState} from 'react';
import {Button, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StatusBar} from "expo-status-bar";
import axios from 'axios';
// const baseUrl = 'https://server-aph4.onrender.com';
const baseUrl = 'https://7c29-37-66-146-127.eu.ngrok.io';

export default function SheetCreation({ navigation }){
    let [data, setData] = useState([]);
    let [selectedCourse, setSelectedCourse] = useState(null);
    let [startHour, setStartHour] = useState(new Date());
    let [endHour, setEndHour] = useState(new Date());
// Invoking get method to perform a GET request to the API
    const getCourses = async () => {
        try {
            const response = await axios.get(`${baseUrl}/course?teacherId=1`);//TODO: change the teacherId to the one of the connected user
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getCourses().then(() => console.log("Call to getCourses done"));
    }
    , []);

    function getStartHoursFromChildComponent(startHourChild) {
        setStartHour(startHourChild);
        console.log("Pass start hour to parent component");
        console.log("End hour: " + startHour);
    }
    function getEndHoursFromChildComponent(endHourChild) {
        setEndHour(endHourChild);
        console.log("Pass end hour to parent component");
        console.log("End hour: " + endHour);
    }

    function getSelectedCourseFromChildComponent(selectedCourseChild) {
        setSelectedCourse(selectedCourseChild);
        console.log("Pass selected course to parent component");
        console.log("Selected course: " + selectedCourse);
    }

    function createSheet() {
        console.log("Create sheet");
        console.log("Course: " + selectedCourse);
        console.log("Start hour: " + startHour);
        console.log("End hour: " + endHour);
        //TODO: send the sheet to the server

        // axios.post(`${baseUrl}/sheet`, {
        //     "courseLabel": "Concurrence",
        //     "courseStartDate": startHour,
        //     "courseEndDate": endHour,
        //     "teacherId": "1",
        //     "signatures": {}
        // }).then(r => console.log(r.data));
    }

    return (
        <View>
            <DropdownComponent data={data} value={selectedCourse} pass={getSelectedCourseFromChildComponent}></DropdownComponent>
            <DatePicker title="Heure de début" pass={getStartHoursFromChildComponent}></DatePicker>
            <DatePicker title="Heure de fin" pass={getEndHoursFromChildComponent}></DatePicker>
            <Button title={"Créer le cours"} onPress={createSheet}></Button>
        </View>
    );
}
const DropdownComponent = props => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };

    useEffect(() => {
        props.pass(value);
    }, [value]);

    return (
        <View style={styles.container}>
            {renderLabel()}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={props.data}
                search
                maxHeight={300}
                labelField="label"
                valueField="id"
                placeholder={!isFocus ? 'Choisir la matière' : '...'}
                searchPlaceholder="Chercher..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.id); //TODO: Stockage double de l'id, à voir si on peut faire autrement
                    props.pass(item.id); //TODO : Renvoie de l'id uniquement ou de l'objet complet ?
                    setIsFocus(false);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color={isFocus ? 'blue' : 'black'}
                        name="Safety"
                        size={20}
                    />
                )}
            />
        </View>
    );
};

const DatePicker = props => {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("Heure");
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };
    const showTimepicker = () => {
        setShow(true);
    }

    useEffect(() => {
        props.pass(date);
    }, [date]);

    return (
        <View>
            <Button onPress={showTimepicker} title={props.title} />
            <Text>selected: {date.toLocaleString()}</Text>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
