import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(93, 131, 181)" }}>
      <View style={styles.container}>
        <Text style={styles.title}>HelloSYD!</Text>

        <Text style={styles.subtitle}>Let's explore SYDNEY</Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.buttonText}>Continue with Email</Text>
        </Pressable>

        <View
          style={{ flexDirection: "row", alignItems: "center", width: "90%" }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          />
          <Text style={{ marginHorizontal: 12, color: "white" }}>OR</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.buttonText}>Continue with Google</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgb(93, 131, 181)",
    paddingTop: 60,
  },
  title: {
    color: "white",
    fontSize: 40,
    marginBottom: 15,
  },
  subtitle: {
    color: "white",
    fontSize: 22,
    marginBottom: 15,
  },

  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    width: "90%",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",

    color: "black",
  },
});
