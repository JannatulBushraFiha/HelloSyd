import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../root/firebaseConfig"; // adjust path
export default function CreateAcount() {
  const [UserName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const router = useRouter();

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        console.log("Welcome, ", userCredential.user, "!");
        router.push("/homepage");
      })
      .catch((error) => {
        console.error("Error signing up: ", error.message);
        alert(error.message);
      });
  };
  return (
    <View style={styles.container}>
      <Text>Create Account</Text>
      <Text
        style={{ alignSelf: "flex-start", marginLeft: 500, marginBottom: 5 }}
      >
        Create UserName
      </Text>
      <TextInput
        style={styles.textbox}
        placeholder="User Name"
        value={UserName}
        onChangeText={setUserName}
      ></TextInput>

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
      ></TextInput>

      <Text
        style={{ alignSelf: "flex-start", marginLeft: 500, marginBottom: 5 }}
      >
        Create Password
      </Text>
      <TextInput
        style={styles.textbox}
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      ></TextInput>

      <Text
        style={{ alignSelf: "flex-start", marginLeft: 500, marginBottom: 5 }}
      >
        Confirm Password
      </Text>
      <TextInput
        style={styles.textbox}
        placeholder="re-type password"
        secureTextEntry
        value={cpassword}
        onChangeText={setCPassword}
      ></TextInput>

      <Pressable style={styles.create_acc_button} onPress={handleCreateAccount}>
        Create Account
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
