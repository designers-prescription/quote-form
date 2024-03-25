import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import getStorage

const firebaseConfig = {
    apiKey: "AIzaSyCIh5juq4sAu19-oi_40SLlM8MGlxq2qxI",
    authDomain: "quote-and-shipping-automation.firebaseapp.com",
    projectId: "quote-and-shipping-automation",
    storageBucket: "quote-and-shipping-automation.appspot.com",
    messagingSenderId: "125383796282",
    appId: "1:125383796282:web:80e9403610690d0cff7703",
    measurementId: "G-SX1RHFSQLV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize and export storage
