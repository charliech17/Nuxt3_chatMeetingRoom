// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export function firebaseInit() {
    const config = useRuntimeConfig()
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: config.FIREBASE_API_KEY, 
        authDomain: config.FIREBASE_AUTH_DOMAIN, 
        databaseURL: config.FIREBASE_DATABASE_URL, 
        projectId: config.FIREBASE_PROJECT_ID, 
        storageBucket: config.FIREBASE_STORAGE_BUCKET, 
        messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID, 
        appId: config.FIREBASE_APP_ID, 
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    return app
}