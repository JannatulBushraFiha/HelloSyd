// app/place.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../root/firebaseConfig";

export default function Place() {
  const router = useRouter();
  const { name, description, suburb, emoji, category, id } =
    useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) return;
      try {
        const ref = doc(db, "users", u.uid, "favourites", id as string);
        const snap = await getDoc(ref);
        setIsSaved(snap.exists());
      } catch (e) {
        console.error(e);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSave = async () => {
    if (!user) {
      Alert.alert("Not logged in", "Please log in to save favourites.");
      return;
    }
    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid, "favourites", id as string);
      if (isSaved) {
        await deleteDoc(ref);
        setIsSaved(false);
      } else {
        await setDoc(ref, {
          id,
          name,
          description,
          suburb,
          emoji,
          category,
          savedAt: new Date().toISOString(),
        });
        setIsSaved(true);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{emoji}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.suburb}>📍 {suburb}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{category}</Text>
          </View>
          <Text style={styles.descTitle}>About</Text>
          <Text style={styles.desc}>{description}</Text>
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, isSaved && styles.savedBtn]}
          onPress={handleToggleSave}
          disabled={saving}
        >
          <Text
            style={[
              styles.saveBtnText,
              isSaved && { color: "rgb(93, 131, 181)" },
            ]}
          >
            {saving
              ? "Saving..."
              : isSaved
                ? "♥ Saved!"
                : "♡ Save to Favourites"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  backBtn: { marginTop: 10, marginBottom: 16 },
  backText: { color: "rgb(93, 131, 181)", fontSize: 16, fontWeight: "600" },
  hero: {
    backgroundColor: "rgb(93, 131, 181)",
    borderRadius: 24,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heroEmoji: { fontSize: 80 },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 26, fontWeight: "bold", color: "#222", marginBottom: 6 },
  suburb: { fontSize: 15, color: "#888", marginBottom: 12 },
  badge: {
    backgroundColor: "#e8f0fe",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: "rgb(93, 131, 181)",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "capitalize",
  },
  descTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  desc: { fontSize: 15, color: "#555", lineHeight: 22 },
  saveBtn: {
    backgroundColor: "rgb(93, 131, 181)",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  savedBtn: { backgroundColor: "#e8f0fe" },
  saveBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
