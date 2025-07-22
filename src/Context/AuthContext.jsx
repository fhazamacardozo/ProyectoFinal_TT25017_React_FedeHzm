import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContextDef";
import { useNavigate } from "react-router-dom";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from "firebase/auth";
import { auth, db } from "../FireBaseConfig";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"; 
// Función para registrar actividad de usuarios nuevos
async function logUserActivity(user) {
    try {
        await addDoc(collection(db, "activity_users"), {
            userId: user.uid,
            userName: user.displayName || user.username || "",
            email: user.email,
            timestamp: serverTimestamp(),
            action: "register"
        });
    } catch (err) {
        console.error("Error registrando actividad de usuario:", err);
    }
}


export function AuthProvider ({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

 // useEffect para manejar el estado de autenticación de Firebase al inicio
    useEffect(() => {
        // onAuthStateChanged es el listener recomendado para saber si el usuario está logueado
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // Usuario logueado
            setIsAuthenticated(true);
            setUser(firebaseUser); // Guarda el objeto de usuario de Firebase

            // Obtener información adicional del usuario de Firestore 
            try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsAdmin(userData.role === "admin");
                setUser({ ...firebaseUser, ...userData }); 
            } else {
                // Si el usuario no tiene un documento en Firestore 
                setIsAdmin(false); // Por defecto no es admin
                await setDoc(userDocRef, { email: firebaseUser.email, role: 'user' });
                setIsAdmin(false);
                setUser({ ...firebaseUser, role: 'user' });
            }
            } catch (error) {
            console.error("Error al obtener datos de usuario de Firestore:", error);
            setIsAdmin(false); 
            }

        } else {
            // Usuario no logueado
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUser(null);
        }
        setLoading(false); // La carga inicial ha terminado
        });

        // Limpia el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, []);


    // Función de Login con Firebase Authentication
    const login = async (email, password) => { 
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            console.log("Usuario logueado:", firebaseUser);

            // El listener onAuthStateChanged ya manejará la actualización de estados,
            // pero puedes hacer una navegación inmediata si lo deseas
            // Recuperar el rol después de iniciar sesión para la navegación
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            let userRole = 'user';
            if (userDoc.exists()) {
                userRole = userDoc.data().role;
            }
            
            if (userRole === "admin") {
                navigate("/Admin/"+userDoc.data().username); // Navega al panel de admin
            } else {
                navigate("/Catalogue");
            }
            return true; // Login exitoso
        } 
        catch (error) {
            console.error("Error de inicio de sesión con Firebase:", error.code, error.message);
            return false; // Login fallido
        }
    };

    // Función de Registro 
    const register = async (email, password, userName, firstName, lastName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            console.log("Usuario registrado:", firebaseUser);

            // Guardar información adicional del usuario en Firestore 
            await setDoc(doc(db, "users", firebaseUser.uid), {
                username: userName,
                firstName: firstName,
                lastName: lastName,
                email: firebaseUser.email,
                role: "user", // Rol por defecto
            });

            // Registrar actividad de usuario nuevo
            await logUserActivity({
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                username: userName,
                email: firebaseUser.email
            });

            navigate("/"); // Navega a home después del registro
            return true;
        } 
        catch (error) {
            console.error("Error de registro con Firebase:", error.code, error.message);
            return false;
        }
    };

    // Función de Logout con Firebase Authentication
    const logout = async () => {
        try {
            await signOut(auth);
            // onAuthStateChanged se encargará de limpiar los estados
            navigate("/login");
        } 
        catch (error) {
            console.error("Error al cerrar sesión con Firebase:", error);
        }
    };

    const value = {
        isAuthenticated,
        isAdmin,
        user,
        loading, // Estado de carga inicial del AuthContext
        login,
        register, 
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}