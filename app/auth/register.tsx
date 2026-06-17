// app/auth/register.tsx
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Register() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Pressable onPress={() => router.push("/auth/createacc")}>
        <Text style={styles.link}>Go to Create Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  link: { color: "skyblue", textDecorationLine: "underline" },
});
