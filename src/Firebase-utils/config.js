// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    getDoc,
    doc,
    deleteDoc,
    query,
    orderBy,
    where,
    onSnapshot,
    updateDoc,
    deleteField, setDoc, writeBatch
} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadString, getMetadata } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREABSE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
    app,
    auth,
    signInWithEmailAndPassword,
    db,
    updateProfile,
    sendPasswordResetEmail,
    addDoc,
    collection,
    getDocs,
    getDoc,
    updateDoc,
    doc,
    deleteDoc,
    query,
    orderBy,
    where,
    onSnapshot,
    storage,
    deleteField,
    uploadString,
    signOut,
    ref, uploadBytesResumable, getDownloadURL, deleteObject, setDoc, writeBatch, getMetadata
};