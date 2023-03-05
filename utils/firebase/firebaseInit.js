// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export function firebaseInit() {
    const config = useRuntimeConfig()
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: config.public.FIREBASE_API_KEY, 
        authDomain: config.public.FIREBASE_AUTH_DOMAIN, 
        databaseURL: config.public.FIREBASE_DATABASE_URL, 
        projectId: config.public.FIREBASE_PROJECT_ID, 
        storageBucket: config.public.FIREBASE_STORAGE_BUCKET, 
        messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID, 
        appId: config.public.FIREBASE_APP_ID, 
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    return app
}