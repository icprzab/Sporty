import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, setDoc, serverTimestamp } from "firebase/firestore";
import { createContext, useContext } from "react"
import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import avatar from "./assets/member.png"
const firebaseConfig = {

}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);


// const AuthContext = createContext();

// export function useAuth() {
//     return useContext(AuthContext)
// }

// export function AuthProvider({ children }) {
//     const [currentUser, setCurrentUser] = useState()
//     const value = { currentUser, createUserDocument }

//     const createUserDocument = async (user, additionalData) => {
//         if (!user) return;

//         const userDoc = doc(db, "users", user.uid);
//         if (!userDoc.exists) {
//             const { email } = user;
//             const { displayName } = additionalData;

//             try {
//                 setDoc(userDoc, { Name: displayName, Email: email, createAt: serverTimestamp() });
//             }

//             catch (error) {
//                 console.log("error in creating user");
//             }
//         }
//     }

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (data) => {
//             if (data) {
//                 setCurrentUser(data)
//             }
//             else {
//                 console.log("Not logged in")
//             }
//         })
//         return () => { unsubscribe(); }
//     }, [])

//     return (<AuthContext.Provider value={value}>
//         {children}
//     </AuthContext.Provider>)
// }

export const createUserDocument = async (user, username, userPassword) => {
    if (!user) return;

    const userDoc = doc(db, "users", user.uid);
    if (!userDoc.exists) {
        const { email } = user;
        const { name } = username;
        const { password } = userPassword;
        try {
            setDoc(userDoc, { Name: name, Email: email, Password: password, createAt: serverTimestamp(), About: null, BirthDay: null, City: null, Gender: null, Intro: null, avatar: null })
        }

        catch (error) {
            console.log("error in creating user");
        }
    }
}


