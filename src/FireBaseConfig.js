// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Para la autenticación
import { getFirestore } from "firebase/firestore"; // Para la base de datos Firestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAm8bNenNPIhcjURQ0PaV9jIg5Xuvx7d9k",
    authDomain: "tt-react-25017-fhzm.firebaseapp.com",
    projectId: "tt-react-25017-fhzm",
    storageBucket: "tt-react-25017-fhzm.firebasestorage.app",
    messagingSenderId: "845884656647",
    appId: "1:845884656647:web:1023f80940e26063abaea2",
    measurementId: "G-0962D850MW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Exporta servicios que usarás
// export default app;
export const auth = getAuth(app); // Servicio de autenticación
export const db = getFirestore(app); // Servicio de base de datos Firestore