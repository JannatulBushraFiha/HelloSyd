// app/event-detail.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventDetail() {
  const router = useRouter();
  const { name, date, venue, category, emoji, url } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{emoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.card}>
          <Text style={styles.name}>{name}</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>📅 Date & Time</Text>
            <Text style={styles.rowValue}>{date}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>📍 Venue</Text>
            <Text style={styles.rowValue}>{venue}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>🎭 Category</Text>
            <Text style={styles.rowValue}>{category}</Text>
          </View>
        </View>

        {/* Buy Tickets Button */}
        {url ? (
          <TouchableOpacity
            style={styles.ticketBtn}
            onPress={() => Linking.openURL(url as string)}
          >
            <Text style={styles.ticketBtnText}>🎟️ Buy Tickets</Text>
          </TouchableOpacity>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  backText: {
    color: "rgb(93, 131, 181)",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 16,
  },
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
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  row: {
    paddingVertical: 10,
  },
  rowLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  ticketBtn: {
    backgroundColor: "#FF6B6B",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  ticketBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
