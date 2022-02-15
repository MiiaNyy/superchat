import firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDaHvjWQBPbi_8qb-53ZZYw6YlMmog89Ig",
    authDomain: "superchat-be9ab.firebaseapp.com",
    projectId: "superchat-be9ab",
    storageBucket: "superchat-be9ab.appspot.com",
    messagingSenderId: "547015847672",
    appId: "1:547015847672:web:427a9f137fe980ba27d50d"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export { db, auth };
