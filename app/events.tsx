// app/events.tsx
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TICKETMASTER_API_KEY } from "../root/config";

type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  category: string;
  emoji: string;
  url: string;
};

const categoryEmoji: Record<string, string> = {
  Music: "🎵",
  Sports: "⚽",
  "Arts & Theatre": "🎭",
  Film: "🎬",
  Miscellaneous: "🎪",
  undefined: "🎉",
};

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const res = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&stateCode=NSW&countryCode=AU&size=50&sort=date,asc`,
      );
      const data = await res.json();

      if (!data._embedded || !data._embedded.events) {
        setError("No events found in NSW right now.");
        return;
      }

      const mapped: Event[] = data._embedded.events.map((e: any) => {
        const category =
          e.classifications?.[0]?.segment?.name ?? "Miscellaneous";
        return {
          id: e.id,
          name: e.name,
          date: `${e.dates?.start?.localDate ?? "TBC"} ${e.dates?.start?.localTime ? e.dates.start.localTime.slice(0, 5) : ""}`,
          venue: e._embedded?.venues?.[0]?.name ?? "Sydney",
          category,
          emoji: categoryEmoji[category] ?? "🎉",
          url: e.url,
        };
      });

      setEvents(mapped);
      const now = new Date();
      setLastUpdated(
        `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
    } catch (e: any) {
      setError("Failed to load events. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = useCallback(() => {
    fetchEvents(true);
  }, [fetchEvents]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["rgb(93, 131, 181)"]}
            tintColor="rgb(93, 131, 181)"
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <Text style={styles.title}>🎉 Events</Text>
            {lastUpdated ? (
              <Text style={styles.updated}>Updated {lastUpdated}</Text>
            ) : null}
          </View>
          <Text style={styles.subtitle}>
            What's on in NSW · Pull down to refresh
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="rgb(93, 131, 181)"
            style={{ marginTop: 60 }}
          />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorEmoji}>😕</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => fetchEvents()}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          events.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/event-detail",
                  params: { ...event },
                })
              }
            >
              <View style={styles.cardTop}>
                <Text style={styles.emoji}>{event.emoji}</Text>
                <View style={styles.info}>
                  <Text style={styles.name}>{event.name}</Text>
                  <Text style={styles.date}>📅 {event.date}</Text>
                  <Text style={styles.venue}>📍 {event.venue}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{event.category}</Text>
                </View>
              </View>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#222" },
  updated: { fontSize: 12, color: "#aaa" },
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
  cardTop: { flexDirection: "row", alignItems: "flex-start" },
  emoji: { fontSize: 32, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 2 },
  date: { fontSize: 13, color: "#888", marginBottom: 2 },
  venue: { fontSize: 13, color: "#888" },
  badge: {
    backgroundColor: "#e8f0fe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 11, fontWeight: "600", color: "rgb(93, 131, 181)" },
  errorBox: { alignItems: "center", marginTop: 60 },
  errorEmoji: { fontSize: 40, marginBottom: 12 },
  errorText: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: "rgb(93, 131, 181)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: "white", fontWeight: "bold", fontSize: 15 },
});
