import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity,
} from "react-native";
export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("./assets/polytech.jpeg")} />
            <StatusBar style="dark" />
            <Text>Veuillez vous identifier avec votre : {"\n"} - numéro étudiant {"\n"} - mail universitaire (professeur) {"\n"}</Text>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="N° étudiant ou mail"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            {/*TODO: uncomment this when the password is implemented*/}
            {/*<View style={styles.inputView}>*/}
            {/*    <TextInput*/}
            {/*        style={styles.TextInput}*/}
            {/*        placeholder="Password."*/}
            {/*        placeholderTextColor="#003f5c"*/}
            {/*        secureTextEntry={true}*/}
            {/*        onChangeText={(password) => setPassword(password)}*/}
            {/*    />*/}
            {/*</View>*/}
            {/*<TouchableOpacity>*/}
            {/*    <Text style={styles.forgot_button}>Forgot Password?</Text>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('SheetCreation')}>
                <Text>LOGIN</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginBottom: 40,
    },
    inputView: {
        backgroundColor: "#46d2ff",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    forgot_button: {
        height: 30,
        marginBottom: 30,
    },
    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#00b8ff",
    },
    statusbar: {
        backgroundColor: "#00b8ff",
    }
});
