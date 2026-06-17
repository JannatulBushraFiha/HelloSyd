// app/add-deal.tsx
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../root/firebaseConfig";

export default function AddDeal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [discount, setDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !location || !discount || !validUntil || !description) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "deals"), {
        name,
        location,
        discount,
        validUntil,
        description,
        emoji: "🏷️",
        category: "New Deal",
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Success!", "Your deal has been submitted.", [
        { text: "OK", onPress: () => router.replace("/deals") },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <Text style={styles.title}>Submit a Deal</Text>
          <Text style={styles.subtitle}>
            Know a great deal in Sydney? Share it!
          </Text>

          <Text style={styles.label}>Deal Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Happy Hour at Opera Bar"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Circular Quay"
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Discount</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 50% OFF or FREE ENTRY"
            placeholderTextColor="#aaa"
            value={discount}
            onChangeText={setDiscount}
          />

          <Text style={styles.label}>Valid Until</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Every day 4–6PM"
            placeholderTextColor="#aaa"
            value={validUntil}
            onChangeText={setValidUntil}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Describe the deal..."
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Pressable
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Submitting..." : "Submit Deal"}
            </Text>
          </Pressable>

          <Text style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  backText: {
    color: "rgb(93, 131, 181)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "skyblue",
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    color: "#222",
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  btn: {
    backgroundColor: "rgb(93, 131, 181)",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
