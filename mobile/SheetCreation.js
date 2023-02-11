import React, {useEffect, useState} from 'react';
import {Button, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {BASE_URL} from "./global";
export default function SheetCreation({ route, navigation }){
    let [data, setData] = useState([]);
    let [selectedCourse, setSelectedCourse] = useState(null);

    const teacherData = route.params.userData;
// Invoking get method to perform a GET request to the API
    const getCourses = async () => {
        try {
            console.log(JSON.stringify(teacherData));
            const response = await axios.get(`${BASE_URL}/course?teacherId=${teacherData.id}`);
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

    //TODO: try to replace by the onChange component method
    function getSelectedCourseFromChildComponent(selectedCourseChild) {
        setSelectedCourse(selectedCourseChild);
        console.log("Pass selected course to parent component");
        console.log("Selected course: " + JSON.stringify(selectedCourse));
    }

    function createSheet() {
        console.log("--- Create sheet ---");
        console.log("Course id : " + selectedCourse.id);

        axios.post(`${BASE_URL}/sheet`, {
            "courseId": selectedCourse.id,
        }).then(r => console.log(r.data));
    }

    return (
        <View>
            <DropdownComponent data={data} value={selectedCourse} pass={getSelectedCourseFromChildComponent}></DropdownComponent>
            <View style={styles.display}>
            {selectedCourse != null? (
                <Text style={styles.title}>{selectedCourse.label}</Text>
                ) : (
                    <Text>Pas de cours sélectionné</Text>
                )
            }
            <Text style={styles.wait}>Affichage en cours de développement...</Text>
            </View>
            <Button title={"Créer le cours"} onPress={createSheet}></Button>
        </View>
    );
}
const DropdownComponent = props => {
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (props.data || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };

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
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    props.pass(item);
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

// const DatePicker = props => {
//     const [date, setDate] = useState(new Date());
//     const [mode, setMode] = useState('time');
//     const [show, setShow] = useState(false);
//     const [title, setTitle] = useState("Heure");
//     const onChange = (event, selectedDate) => {
//         const currentDate = selectedDate;
//         setShow(false);
//         setDate(currentDate);
//     };
//     const showTimepicker = () => {
//         setShow(true);
//     }
//
//     useEffect(() => {
//         props.pass(date);
//     }, [date]);
//
//     return (
//         <View>
//             <Button onPress={showTimepicker} title={props.title} />
//             <Text>selected: {date.toLocaleString()}</Text>
//             {show && (
//                 <DateTimePicker
//                     testID="dateTimePicker"
//                     value={date}
//                     mode={mode}
//                     is24Hour={true}
//                     onChange={onChange}
//                 />
//             )}
//         </View>
//     );
// };

const styles = StyleSheet.create({
    display: {
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        marginHorizontal: 6,
        paddingTop: 16,
        height: 400,
    },
    title: {
        fontSize: 20,
    },
    wait: {
        fontSize: 16,
        color: 'red',
        margin: 20,
    },
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
