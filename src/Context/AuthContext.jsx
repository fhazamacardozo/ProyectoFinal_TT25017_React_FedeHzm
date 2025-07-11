import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Importa las funciones de autenticación de Firebase
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from "firebase/auth";
import { auth, db } from "../FireBaseConfig";
// Importa la instancia de auth y db
import { doc, getDoc, setDoc } from "firebase/firestore"; 

const AuthContext = createContext();

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

            // Opcional: Obtener información adicional del usuario de Firestore 
            try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsAdmin(userData.role === "admin");
                // Puedes extender el objeto user con estos datos si lo necesitas
                setUser({ ...firebaseUser, ...userData }); 
            } else {
                // Si el usuario no tiene un documento en Firestore (ej. recién registrado sin info extra)
                setIsAdmin(false); // Por defecto no es admin
                // Opcional: Crear un documento base para el nuevo usuario aquí
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
    const login = async (email, password) => { // Firebase usa email, no username
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
                navigate("/");
            }
            return true; // Login exitoso
        } 
        catch (error) {
            console.error("Error de inicio de sesión con Firebase:", error.code, error.message);
            // Puedes mapear los códigos de error de Firebase a mensajes más amigables
            return false; // Login fallido
        }
    };

    // Función de Registro (opcional, pero útil para agregar nuevos usuarios)
    const register = async (email, password, userName, firstName, lastName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            console.log("Usuario registrado:", firebaseUser);

            // Opcional: Guardar información adicional del usuario en Firestore (ej. rol por defecto)
            await setDoc(doc(db, "users", firebaseUser.uid), {
                username: userName,
                firstName: firstName,
                lastName: lastName,
                email: firebaseUser.email,
                role: "user", // Rol por defecto
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