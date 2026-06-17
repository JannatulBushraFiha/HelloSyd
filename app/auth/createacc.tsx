// app/auth/createacc.tsx
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { auth } from "../../root/firebaseConfig";

export default function CreateAccount() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateAccount = async () => {
    if (!userName || !email || !password || !cpassword) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== cpassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/homepage");
    } catch (error: any) {
      Alert.alert("Sign up failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join HelloSYD!</Text>

      <TextInput
        style={styles.textbox}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={userName}
        onChangeText={setUserName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.textbox}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.textbox}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.textbox}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={cpassword}
        onChangeText={setCPassword}
      />

      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleCreateAccount}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating account..." : "Create Account"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "rgb(93, 131, 181)",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 30,
  },
  textbox: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 12,
    borderColor: "skyblue",
    borderWidth: 1.5,
    width: "100%",
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "rgb(93, 131, 181)",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    marginTop: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "skyblue",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});
