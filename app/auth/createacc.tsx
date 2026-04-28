import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function CreateAcount() {
  const [UserName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <View>
      <h1>Create Account</h1>
      <Text>Create UserName</Text>
      <TextInput
        style={styles.textbox}
        placeholder="User Name"
        value={UserName}
        onChangeText={setUserName}
      ></TextInput>

      <Text>Enter your email</Text>
      <TextInput
        style={styles.textbox}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      ></TextInput>

      <Text>Create Password</Text>
      <TextInput
        style={styles.textbox}
        placeholder="Email"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      ></TextInput>

      <Text>Confirm Password</Text>
      <TextInput
        style={styles.textbox}
        placeholder="re-type password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      ></TextInput>

      <Pressable style={styles.create_acc_button}>Create Account</Pressable>
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
    padding: 12, // smaller padding so it doesn’t become tall
    borderRadius: 20,
    borderColor: "skyblue",
    borderWidth: 2,
    width: "40%",
    alignSelf: "center",
    alignContent: "center",
    marginBottom: 20, // ⭐ makes it long sideways
  },
  create_acc_button: {
    backgroundColor: "skyblue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "20%",
    marginBottom: 10,
  },
  create_acc_link: {
    color: "skyblue",
    textDecorationLine: "underline",
  },
});
