// app/deals.tsx
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

type Deal = {
  id: string;
  name: string;
  location: string;
  discount: string;
  category: string;
  validUntil: string;
  emoji: string;
  description: string;
};

const categoryColors: Record<string, string> = {
  "Food & Drink": "#FF6B6B",
  Attraction: "#74B9FF",
  Transport: "#96CEB4",
  Experience: "#A29BFE",
  Market: "#FD79A8",
};

export default function Deals() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const snap = await getDocs(collection(db, "deals"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Deal[];
        setDeals(data);
      } catch (e: any) {
        setError("Failed to load deals. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏷️ Deals</Text>
          <Text style={styles.subtitle}>Best deals around Sydney</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/add-deal")}
          >
            <Text style={styles.addBtnText}>+ Submit a Deal</Text>
          </TouchableOpacity>
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
        ) : deals.length === 0 ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>No deals found.</Text>
          </View>
        ) : (
          deals.map((deal) => (
            <View key={deal.id} style={styles.card}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{deal.discount}</Text>
              </View>
              <View style={styles.cardTop}>
                <Text style={styles.emoji}>{deal.emoji}</Text>
                <View style={styles.info}>
                  <Text style={styles.name}>{deal.name}</Text>
                  <Text style={styles.location}>📍 {deal.location}</Text>
                  <Text style={styles.valid}>⏰ {deal.validUntil}</Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: categoryColors[deal.category] ?? "#ddd",
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>{deal.category}</Text>
                </View>
              </View>
              <Text style={styles.desc}>{deal.description}</Text>
            </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  discountBadge: {
    backgroundColor: "rgb(93, 131, 181)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  discountText: { color: "white", fontWeight: "bold", fontSize: 13 },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  emoji: { fontSize: 32, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 2 },
  location: { fontSize: 13, color: "#888", marginBottom: 2 },
  valid: { fontSize: 13, color: "#888" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  addBtn: {
    backgroundColor: "rgb(93, 131, 181)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  addBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  badgeText: { fontSize: 11, fontWeight: "600", color: "#333" },
  desc: { fontSize: 13, color: "#666", lineHeight: 20 },
  errorBox: { alignItems: "center", marginTop: 60 },
  errorText: { fontSize: 15, color: "#888" },
});
