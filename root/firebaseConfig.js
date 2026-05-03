import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
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
export const auth = getAuth(app);
export default app;
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
