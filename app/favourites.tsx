// app/favourites.tsx
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../root/firebaseConfig";

type FavouriteItem = {
  id: string;
  name: string;
  description: string;
  suburb: string;
  emoji: string;
  category: string;
};

export default function Favourites() {
  const router = useRouter();
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const ref = collection(db, "users", user.uid, "favourites");
      const unsubscribeSnap = onSnapshot(ref, (snap) => {
        const items = snap.docs.map((doc) => doc.data() as FavouriteItem);
        setFavourites(items);
        setLoading(false);
      });
      return unsubscribeSnap;
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>♥ Favourites</Text>
          <Text style={styles.subtitle}>Places you've saved</Text>
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="rgb(93, 131, 181)"
            style={{ marginTop: 60 }}
          />
        ) : favourites.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap ♡ on any place to save it here
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push("/scenic-spots")}
            >
              <Text style={styles.exploreBtnText}>Explore Places</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favourites.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/place", params: { ...item } })
              }
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.suburb}>📍 {item.suburb}</Text>
                <Text style={styles.desc} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 10, paddingBottom: 24 },
  backText: {
    color: "rgb(93, 131, 181)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#222", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#888" },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emoji: { fontSize: 36, marginRight: 14 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#222" },
  suburb: { fontSize: 13, color: "#888", marginTop: 2 },
  desc: { fontSize: 13, color: "#666", marginTop: 4 },
  arrow: { fontSize: 24, color: "#ccc", marginLeft: 8 },
  empty: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: { fontSize: 15, color: "#888", marginBottom: 24 },
  exploreBtn: {
    backgroundColor: "rgb(93, 131, 181)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: { color: "white", fontWeight: "bold", fontSize: 15 },
});
