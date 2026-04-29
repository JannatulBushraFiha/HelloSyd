import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>LogIn/ SignUp</Text>
      <Text
        style={{ alignSelf: "flex-start", marginLeft: 500, marginBottom: 5 }}
      >
        Enter your email
      </Text>
      <TextInput
        style={styles.textbox}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Text
        style={{ alignSelf: "flex-start", marginLeft: 500, marginBottom: 5 }}
      >
        Enter your Password
      </Text>
      <TextInput
        style={styles.textbox}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.login_button}> Login</Pressable>
      <Text>New to YourSydGuide?</Text>
      <Pressable onPress={() => router.push("/auth/createacc")}>
        <Text style={styles.create_acc_link}>Create New Account</Text>
      </Pressable>
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
    textDecorationLine: "underline",
  },
});
