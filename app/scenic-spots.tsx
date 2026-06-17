// app/scenic-spots.tsx
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
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
import { db } from "../root/firebaseConfig";

type Spot = {
  id: string;
  name: string;
  suburb: string;
  emoji: string;
  category: string;
  description: string;
};

export default function ScenicSpots() {
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const snap = await getDocs(collection(db, "scenicSpots"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Spot[];
        setSpots(data);
      } catch (e: any) {
        setError("Failed to load spots. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏛️ Scenic Spots</Text>
          <Text style={styles.subtitle}>Top places to visit in Sydney</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="rgb(93, 131, 181)"
            style={{ marginTop: 60 }}
          />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : spots.length === 0 ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>No spots found.</Text>
          </View>
        ) : (
          spots.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/place",
                  params: { ...spot },
                })
              }
            >
              <Text style={styles.emoji}>{spot.emoji}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{spot.name}</Text>
                <Text style={styles.suburb}>📍 {spot.suburb}</Text>
                <Text style={styles.desc} numberOfLines={2}>
                  {spot.description}
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
  errorBox: { alignItems: "center", marginTop: 60 },
  errorText: { fontSize: 15, color: "#888" },
});
