import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAV9Mo7egZGI6p6YjvPlRSSCZsBLaIJv4E",
    authDomain: "sporty-12fe2.firebaseapp.com",
    projectId: "sporty-12fe2",
    storageBucket: "sporty-12fe2.appspot.com",
    messagingSenderId: "768116093172",
    appId: "1:768116093172:web:fb410f93d8b651fec16ea1",
    measurementId: "G-5V99KGYKS6"
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);



