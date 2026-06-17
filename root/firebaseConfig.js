import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBXCn_WZqzUiVKphl5o7K4qhFNgnw7f5Aw",
  authDomain: "hellosyd.firebaseapp.com",
  projectId: "hellosyd",
  storageBucket: "hellosyd.firebasestorage.app",
  messagingSenderId: "349475386523",
  appId: "1:349475386523:web:ba0a9c6315e0453747023e",
  measurementId: "G-JMPGE5C8PC",
};

const app = initializeApp(firebaseConfig);

const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(
          require("@react-native-async-storage/async-storage").default,
        ),
      });

export const db = getFirestore(app);
export { auth };
export default app;
