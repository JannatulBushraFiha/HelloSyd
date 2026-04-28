
import {Text, View, TextInput, StyleSheet, Pressable} from "react-native"
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Profile() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style = {styles.container}>
            <h1 style = {styles.text}>LogIn/ SignUp</h1>
            <Text style = {{alignSelf: 'flex-start', marginLeft: 390, marginBottom: 5} }>
            Enter your email</Text>
            <TextInput style = {styles.textbox}
             placeholder="Email"
             value = {email}
             onChangeText = {setEmail} /> 
             <Text style = {{alignSelf: 'flex-start', marginLeft: 390, marginBottom: 5 }}>Enter your Password</Text>
             <TextInput style = {styles.textbox}
             placeholder="Password"
             secureTextEntry
             value = {password}
             onChangeText={setPassword}
             />
             <Pressable style = {styles.login_button}> Login</Pressable>
             <Text>New to YourSydGuide? <Pressable><Text style = {styles.create_acc_link}>Create New Account</Text></Pressable></Text>
             
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        alignItems: "center",
        backgroundColor: "white",
    },
    text: {
        color: "skyblue",    
    },
    textbox: {
        backgroundColor: "white",
        padding: 12,        // smaller padding so it doesn’t become tall
        borderRadius: 20,
        borderColor: "skyblue",
        borderWidth: 2,
        width: "40%", 
        alignSelf: "center",
        alignContent: "center", 
        marginBottom: 20,   // ⭐ makes it long sideways
    },
    login_button: {
        backgroundColor: "skyblue",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        width: "20%",
        marginBottom: 10,
    },
    create_acc_link: {
        color: "skyblue",
        textDecorationLine: "underline"
    }
});