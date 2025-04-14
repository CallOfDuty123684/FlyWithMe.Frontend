import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import app from "./firebaseConfig";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const App = () => {
    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);

    // Fetch users from Firestore
    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersArray = [];
            querySnapshot.forEach((doc) => {
                usersArray.push(doc.data());
            });
            setUsersList(usersArray);
        } catch (error) {
            console.error("Error getting documents:", error);
        }
    };

    // Sign-in using Google
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const loggedInUser = result.user;
            setUser(loggedInUser);  // Store user details
            saveUserToFirestore(loggedInUser);  // Save user data to Firestore
        } catch (error) {
            console.error("Login Failed", error);
        }
    };

    // Sign-out user
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);  // Clear user on logout
        } catch (error) {
            console.error("Logout Failed", error);
        }
    };

    // Save user data to Firestore
    const saveUserToFirestore = async (user) => {
        try {
            const userRef = doc(db, "users", user.uid); // Store data under UID
            await setDoc(userRef, {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                lastLogin: new Date(),
            }, { merge: true }); // Merge to avoid overwriting data
            console.log("User data saved!");
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    };

    // Fetch users from Firestore on initial load
    useEffect(() => {
        if (db) {
            fetchUsers();
        }
    }, [db]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {user ? (
                <>
                    <h2>Welcome, {user.displayName}!</h2>
                    <img src={user.photoURL} alt="User Profile" width="100" />
                    <p>Email: {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                    <h3>Signed-in Users List:</h3>
                    <ul>
                        {usersList.map((userData, index) => (
                            <li key={index}>
                                <img src={userData.photoURL} alt={userData.displayName} width="50" />
                                <span>{userData.displayName}</span>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <button onClick={handleLogin}>Sign in with Google</button>
            )}
        </div>
    );
};

export default App;
