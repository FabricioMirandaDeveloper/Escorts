import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCtS9T0FRlzdGr-1BypvBGJjdzIP5A2auY",
    authDomain: "proyecto-scort.firebaseapp.com",
    projectId: "proyecto-scort",
    storageBucket: "proyecto-scort.firebasestorage.app",
    messagingSenderId: "234577863375",
    appId: "1:234577863375:web:793fb181832cd4cf5a0dba",
    measurementId: "G-5LF1VR7SFG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export {auth, db}