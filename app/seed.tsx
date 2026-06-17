// app/seed.tsx
import { useRouter } from "expo-router";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../root/firebaseConfig";

const scenicSpots = [
  {
    id: "1",
    name: "Sydney Opera House",
    suburb: "CBD",
    emoji: "🎭",
    category: "explore",
    description:
      "One of the world's most recognisable buildings, hosting over 1,500 performances a year.",
  },
  {
    id: "2",
    name: "Bondi Beach",
    suburb: "Bondi",
    emoji: "🏖️",
    category: "beaches",
    description:
      "Sydney's most iconic beach, famous for its golden sand and the Bondi to Coogee coastal walk.",
  },
  {
    id: "3",
    name: "Sydney Harbour Bridge",
    suburb: "CBD",
    emoji: "🌉",
    category: "explore",
    description:
      "The world's largest steel arch bridge. Walk across for free or climb for panoramic views.",
  },
  {
    id: "4",
    name: "Taronga Zoo",
    suburb: "Mosman",
    emoji: "🦒",
    category: "explore",
    description:
      "Home to over 4,000 animals with stunning harbour views. One of the best zoos in the world.",
  },
  {
    id: "5",
    name: "Royal Botanic Garden",
    suburb: "CBD",
    emoji: "🌿",
    category: "explore",
    description:
      "Free entry, beautiful harbour views and 30 hectares of gardens in the heart of the city.",
  },
];

const deals = [
  {
    id: "1",
    name: "Happy Hour at Opera Bar",
    location: "Circular Quay",
    discount: "50% OFF",
    category: "Food & Drink",
    validUntil: "Every day 4–6PM",
    emoji: "🍺",
    description:
      "Half price drinks with one of the best views of the Opera House.",
  },
  {
    id: "2",
    name: "Taronga Zoo Student Discount",
    location: "Mosman",
    discount: "25% OFF",
    category: "Attraction",
    validUntil: "Year round",
    emoji: "🦒",
    description: "Show your student ID at the gate and get 25% off admission.",
  },
  {
    id: "3",
    name: "Art Gallery of NSW",
    location: "CBD",
    discount: "FREE ENTRY",
    category: "Attraction",
    validUntil: "Daily",
    emoji: "🎨",
    description:
      "Free general admission every day. One of Australia's premier art galleries.",
  },
  {
    id: "4",
    name: "Mamak Malaysian Lunch Special",
    location: "Haymarket",
    discount: "$12 MEAL",
    category: "Food & Drink",
    validUntil: "Mon–Fri 11AM–3PM",
    emoji: "🍜",
    description: "Roti canai + curry + drink for $12. Best value lunch in CBD.",
  },
  {
    id: "5",
    name: "Paddy's Markets",
    location: "Haymarket",
    discount: "FREE ENTRY",
    category: "Market",
    validUntil: "Wed–Sun 10AM–6PM",
    emoji: "🛒",
    description:
      "Hundreds of stalls with fresh produce, souvenirs and clothing.",
  },
];

const eatAndDrink = [
  {
    id: "1",
    name: "Mamak",
    suburb: "Haymarket",
    emoji: "🍜",
    category: "eat",
    description:
      "Sydney's most loved Malaysian restaurant. Famous for roti canai, satay, and nasi lemak. Always a queue but always worth it.",
  },
  {
    id: "2",
    name: "Grounds of Alexandria",
    suburb: "Alexandria",
    emoji: "☕",
    category: "eat",
    description:
      "Iconic Sydney brunch spot with a working farm, fresh pastries, and specialty coffee. Perfect weekend morning visit.",
  },
  {
    id: "3",
    name: "Chat Thai",
    suburb: "Haymarket",
    emoji: "🌶️",
    category: "eat",
    description:
      "Authentic Thai street food in the heart of Chinatown. Known for pad thai, green curry, and mango sticky rice.",
  },
  {
    id: "4",
    name: "Opera Bar",
    suburb: "Circular Quay",
    emoji: "🍸",
    category: "eat",
    description:
      "Cocktails and food with the best view in Sydney — Opera House on one side, Harbour Bridge on the other.",
  },
  {
    id: "5",
    name: "Bourke Street Bakery",
    suburb: "Surry Hills",
    emoji: "🥐",
    category: "eat",
    description:
      "Sydney's most famous bakery. Known for sourdough, sausage rolls, and pastries. Lines form early — get there before 9am.",
  },
  {
    id: "6",
    name: "Fratelli Fresh",
    suburb: "CBD",
    emoji: "🍝",
    category: "eat",
    description:
      "Fresh Italian pasta, antipasto, and wood-fired pizza in a relaxed setting. Great for lunch or dinner.",
  },
  {
    id: "7",
    name: "Ms G's",
    suburb: "Potts Point",
    emoji: "🍱",
    category: "eat",
    description:
      "Asian-inspired share plates with a modern twist. Fun, loud, and delicious. Book ahead on weekends.",
  },
  {
    id: "8",
    name: "Gelato Messina",
    suburb: "Darlinghurst",
    emoji: "🍦",
    category: "eat",
    description:
      "Sydney's best gelato. Unique flavours change weekly. The salted caramel and pistachio are legendary.",
  },
];

export default function Seed() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      for (const spot of scenicSpots) {
        await setDoc(doc(collection(db, "scenicSpots"), spot.id), spot);
      }
      for (const deal of deals) {
        await setDoc(doc(collection(db, "deals"), deal.id), deal);
      }
      for (const place of eatAndDrink) {
        await setDoc(doc(collection(db, "eatAndDrink"), place.id), place);
      }
      setDone(true);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seed Database</Text>
      <Text style={styles.subtitle}>
        This will add all scenic spots, deals and eat & drink to Firestore.
      </Text>

      {done ? (
        <>
          <Text style={styles.success}>✅ Done! Database seeded.</Text>
          <Pressable
            style={styles.btn}
            onPress={() => router.replace("/homepage")}
          >
            <Text style={styles.btnText}>Go to Homepage</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={handleSeed}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>Seed Now</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginBottom: 32,
  },
  success: {
    fontSize: 18,
    color: "green",
    marginBottom: 24,
  },
  btn: {
    backgroundColor: "rgb(93, 131, 181)",
    padding: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
