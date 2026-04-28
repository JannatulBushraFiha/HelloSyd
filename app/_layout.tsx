import { HeaderTitle } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    
    <Stack>
    <Stack.Screen name = "index" options = {{headerTitle: "Home"}}/>
    <Stack.Screen name = "profile"
   options = {{ headerTitle: "Profile",
   }}
   />
    </Stack>
  );
}
