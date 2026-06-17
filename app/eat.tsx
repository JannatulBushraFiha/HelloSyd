// app/eat.tsx
import { useRouter } from "expo-router";
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

type Place = {
  id: string;
  name: string;
  suburb: string;
  emoji: string;
  category: string;
  description: string;
};

const FOOD_EMOJIS: Record<string, string> = {
  restaurant: "🍽️",
  cafe: "☕",
  bar: "🍺",
  pub: "🍺",
  fast_food: "🍔",
  food_court: "🍜",
  ice_cream: "🍦",
  bakery: "🥐",
};

export default function EatAndDrink() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "HelloSYD/1.0 (Sydney city guide app)",
          },
          body: `data=[out:json][timeout:25];node["amenity"~"restaurant|cafe|bar|pub|fast_food|bakery"]["name"](-33.95,151.15,-33.82,151.25);out 50;`,
        });

        const data = await res.json();

        if (!data.elements || data.elements.length === 0) {
          setError("No places found right now.");
          return;
        }

        const mapped: Place[] = data.elements
          .filter((el: any) => el.tags?.name)
          .sort(() => Math.random() - 0.5)
          .slice(0, 20)
          .map((el: any) => {
            const amenity = el.tags?.amenity ?? "restaurant";
            const cuisine = el.tags?.cuisine ?? "";
            const suburb =
              el.tags?.["addr:suburb"] ?? el.tags?.["addr:city"] ?? "Sydney";
            return {
              id: String(el.id),
              name: el.tags.name,
              suburb,
              emoji: FOOD_EMOJIS[amenity] ?? "🍽️",
              category: "eat",
              description: cuisine
                ? `${amenity.replace(/_/g, " ")} · ${cuisine.replace(/;/g, ", ")} cuisine`
                : `${amenity.replace(/_/g, " ")} in Sydney`,
            };
          });

        setPlaces(mapped);
      } catch (e: any) {
        setError("Failed to load places. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🍜 Eat & Drink</Text>
          <Text style={styles.subtitle}>
            Live restaurant data · Greater Sydney
          </Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>🟢 LIVE — OpenStreetMap</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="rgb(93, 131, 181)" />
            <Text style={styles.loadingText}>
              Fetching live restaurant data...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          places.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/place",
                  params: { ...place },
                })
              }
            >
              <Text style={styles.emoji}>{place.emoji}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{place.name}</Text>
                <Text style={styles.suburb}>📍 {place.suburb}</Text>
                <Text style={styles.desc}>{place.description}</Text>
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
  subtitle: { fontSize: 15, color: "#888", marginBottom: 8 },
  liveBadge: {
    backgroundColor: "#e8f5e9",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveBadgeText: { fontSize: 11, fontWeight: "600", color: "#2e7d32" },
  loadingBox: { alignItems: "center", marginTop: 60 },
  loadingText: { marginTop: 12, fontSize: 14, color: "#888" },
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
  desc: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    textTransform: "capitalize",
  },
  arrow: { fontSize: 24, color: "#ccc", marginLeft: 8 },
  errorBox: { alignItems: "center", marginTop: 60 },
  errorText: { fontSize: 15, color: "#888" },
});
