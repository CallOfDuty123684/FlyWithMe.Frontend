import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REACT_APP_FIREBASE_API_KEY", // Ensure this is defined in your .env file
  authDomain: "fly-with-me-website-efcdb.firebaseapp.com",
  projectId: "fly-with-me-website-efcdb",
  storageBucket: "fly-with-me-website-efcdb.appspot.com",
  messagingSenderId: "828472826252",
  appId: "1:828472826252:web:eedd06d788110a0f7c5ea9",
  measurementId: "G-VK2Q6VJW0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export services for use in your app
export { auth, db };
export default app;
