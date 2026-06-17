// app/homepage.tsx
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
import { ANTHROPIC_API_KEY, TICKETMASTER_API_KEY } from "../root/config";

const categories = [
  { id: "eat", label: "🍜 Eat & Drink", color: "#FF6B6B" },
  { id: "explore", label: "🏛️ Explore", color: "#4ECDC4" },
  { id: "events", label: "🎉 Events", color: "#96CEB4" },
  { id: "deals", label: "🏷️ Deals", color: "#A29BFE" },
];

export default function Homepage() {
  const router = useRouter();
  const [suggestion, setSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [featuredPlaces, setFeaturedPlaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("../root/firebaseConfig");
        const snap = await getDocs(collection(db, "scenicSpots"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFeaturedPlaces(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFeatured();
  }, []);

  const getAISuggestion = async () => {
    setLoadingSuggestion(true);
    setSuggestion("");

    const now = new Date();
    const hour = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeString = `${hour}:${minutes} ${hour < 12 ? "AM" : "PM"}`;
    const dayName = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][now.getDay()];
    const timeOfDay =
      hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    // Fetch all places dynamically from Firestore
    let allPlaces: string[] = [];
    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const { db } = await import("../root/firebaseConfig");

      const [spotsSnap, dealsSnap] = await Promise.all([
        getDocs(collection(db, "scenicSpots")),
        getDocs(collection(db, "deals")),
      ]);

      const spots = spotsSnap.docs.map((d) => {
        const data = d.data();
        return `${data.name} (${data.suburb}) — scenic spot`;
      });

      // Fetch live eat & drink from OpenStreetMap
      let eat: string[] = [];
      try {
        const eatRes = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: `[out:json][timeout:25];node["amenity"~"restaurant|cafe|bar|pub|fast_food|bakery"]["name"](-33.95,151.15,-33.82,151.25);out 50;`,
        });
        const eatData = await eatRes.json();
        eat = eatData.elements
          .filter((el: any) => el.tags?.name)
          .sort(() => Math.random() - 0.5)
          .slice(0, 15)
          .map((el: any) => {
            const amenity = el.tags?.amenity ?? "restaurant";
            const cuisine = el.tags?.cuisine ?? "";
            return `${el.tags.name} (Sydney) — ${amenity}${cuisine ? `, ${cuisine} cuisine` : ""}`;
          });
      } catch (e) {
        eat = [
          "Grounds of Alexandria — cafe",
          "Chat Thai (Haymarket) — Thai restaurant",
        ];
      }

      const deals = dealsSnap.docs.map((d) => {
        const data = d.data();
        return `${data.name} (${data.location}) — deal: ${data.discount}, valid ${data.validUntil}`;
      });

      allPlaces = [...spots, ...eat, ...deals].sort(() => Math.random() - 0.5);
      console.log("ALL PLACES SENT TO AI:", allPlaces.slice(0, 5));
      console.log("EAT COUNT:", eat.length);
    } catch (e) {
      allPlaces = [
        "Sydney Opera House (CBD)",
        "Bondi Beach (Bondi)",
        "Taronga Zoo (Mosman)",
      ];
    }

    // Fetch live events from Ticketmaster
    let eventsContext = "No upcoming events found.";

    try {
      const eventsRes = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&stateCode=NSW&countryCode=AU&size=5&sort=date,asc`,
      );
      const eventsData = await eventsRes.json();
      if (eventsData._embedded?.events) {
        const eventList = eventsData._embedded.events
          .slice(0, 5)
          .map((e: any) => {
            const date = e.dates?.start?.localDate ?? "TBC";
            const time = e.dates?.start?.localTime?.slice(0, 5) ?? "";
            const venue = e._embedded?.venues?.[0]?.name ?? "Sydney";
            return `${e.name} at ${venue} on ${date} ${time}`;
          })
          .join("\n");
        eventsContext = `Upcoming live events in NSW:\n${eventList}`;
        console.log("EVENTS SENT TO AI:", eventsContext);
      }
    } catch (e) {
      // silently fail
    }

    // Get user favourites from Firestore
    let favouritesContext = "The user has no saved favourites yet.";
    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const { db, auth } = (await import("../root/firebaseConfig")) as any;
      const user = auth.currentUser;
      if (user) {
        const snap = await getDocs(
          collection(db, "users", user.uid, "favourites"),
        );
        if (!snap.empty) {
          const favNames = snap.docs.map((d: any) => d.data().name).join(", ");
          favouritesContext = `The user has saved these favourites: ${favNames}. Consider their interests when suggesting.`;
        }
      }
    } catch (e) {
      // silently fail
    }

    const randomSeed = Math.floor(Math.random() * 1000);
    const randomIndex = (randomSeed % allPlaces.length) + 1;

    const prompt = `You are a Sydney local guide inside the HelloSYD app.

Current context:
- Time: ${timeString} on a ${dayName} ${isWeekend ? "(weekend)" : "(weekday)"}
- Time of day: ${timeOfDay}
- ${favouritesContext}

Available places, food spots and deals in Sydney (shuffled randomly):
${allPlaces.map((p, i) => `${i + 1}. ${p}`).join("\n")}

${eventsContext}

Suggest item number ${randomIndex} from the places list above unless there is a genuine concert, festival, sports match or theatre event — then suggest that instead. Be specific about why this is good right now. 2 sentences maximum.`;

    const randomSeed2 = Math.floor(Math.random() * 1000);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 200,
          system: `You are a Sydney local guide. 
          List exactly 5 things to do right now based on the time and day. 
          Format as a numbered list 1-5.
          Each item is one short sentence under 15 words. 
          No greetings, no emojis, no extra text.`,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const text = data.content?.[0]?.text ?? "Sydney is amazing — go explore!";
      setSuggestion(text);
    } catch (e) {
      setSuggestion("Sydney is amazing today — go explore!");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Sydney! 👋</Text>
          <Text style={styles.subheading}>What do you want to do today?</Text>
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => router.push("/favourites")}
          >
            <Text style={styles.favBtnText}>♥ My Favourites</Text>
          </TouchableOpacity>
          {/* AI Suggestion */}
          <View style={styles.aiBox}>
            <TouchableOpacity
              style={styles.aiBtn}
              onPress={getAISuggestion}
              disabled={loadingSuggestion}
            >
              {loadingSuggestion ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.aiBtnText}>✨ What should I do today?</Text>
              )}
            </TouchableOpacity>
            {suggestion ? (
              <View style={styles.suggestionBox}>
                <Text style={styles.suggestionLabel}>✨ AI Suggestion</Text>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            ) : null}
          </View>
          {/* Temp — remove after seeding
          <Pressable onPress={() => router.push("/seed")}> */}
          {/* <Text style={{ color: "red", marginTop: 10 }}>Seed DB</Text> */}
          {/* </Pressable> */}
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { backgroundColor: cat.color }]}
              onPress={() => {
                if (cat.id === "explore") router.push("/scenic-spots");
                else if (cat.id === "eat") router.push("/eat");
                else if (cat.id === "deals") router.push("/deals");
                else if (cat.id === "events") router.push("/events");
              }}
            >
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Places — from Firestore */}
        <Text style={styles.sectionTitle}>Featured Places</Text>
        {featuredPlaces.length === 0 ? (
          <ActivityIndicator color="rgb(93, 131, 181)" />
        ) : (
          featuredPlaces.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeCard}
              onPress={() =>
                router.push({
                  pathname: "/place",
                  params: { ...place },
                })
              }
            >
              <Text style={styles.placeEmoji}>{place.emoji}</Text>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeSuburb}>📍 {place.suburb}</Text>
                <Text style={styles.placeDesc}>{place.description}</Text>
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
  header: { paddingTop: 20, paddingBottom: 24 },
  greeting: { fontSize: 28, fontWeight: "bold", color: "rgb(93, 131, 181)" },
  subheading: { fontSize: 16, color: "#888", marginTop: 4 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 14,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },
  categoryCard: {
    width: "47%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: { color: "white", fontWeight: "bold", fontSize: 16 },
  placeCard: {
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
  placeEmoji: { fontSize: 36, marginRight: 14 },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 17, fontWeight: "bold", color: "#222" },
  placeSuburb: { fontSize: 13, color: "#888", marginTop: 2 },
  placeDesc: { fontSize: 13, color: "#666", marginTop: 4 },
  arrow: { fontSize: 24, color: "#ccc", marginLeft: 8 },
  favBtn: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "rgb(93, 131, 181)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  favBtnText: { color: "rgb(93, 131, 181)", fontWeight: "600", fontSize: 14 },
  aiBox: { width: "100%", marginTop: 12 },
  aiBtn: {
    backgroundColor: "rgb(93, 131, 181)",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  aiBtnText: { color: "white", fontWeight: "bold", fontSize: 15 },
  suggestionBox: {
    backgroundColor: "#e8f0fe",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  suggestionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgb(93, 131, 181)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  suggestionText: { fontSize: 14, color: "#333", lineHeight: 22 },
});
