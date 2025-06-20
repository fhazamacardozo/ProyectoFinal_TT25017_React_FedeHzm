import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();
// URL base de la Fake Store API
const FAKESTORE_API_BASE_URL = "https://fakestoreapi.com";

export function AuthProvider ({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Efecto para verificar si hay una sesión activa en localStorage al cargar la app
    useEffect(() => {
    try {
        const storedAuth = localStorage.getItem("isAuthenticated");
        const storedToken = localStorage.getItem("authToken"); 
        const storedUser = localStorage.getItem("user");
        const storedAdmin = localStorage.getItem("isAdmin");

        if (storedAuth === 'true' && storedToken && storedUser) {
            setIsAuthenticated(true);
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAdmin(storedAdmin === 'true'); 
        }
        } catch (error) {
            console.error("Error al recuperar datos de localStorage:", error);
            // Limpiar datos corruptos
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            localStorage.removeItem("isAdmin");
        } finally {
            setLoading(false);
        }
    }, []);


    // Función de Login: Interactúa con el endpoint POST /auth/login de Fake Store API
    const login = async (username, password) => {
        try {
        const response = await axios.post(`${FAKESTORE_API_BASE_URL}/auth/login`, {
            username,
            password,
        });

        // La API retorna un objeto con { token: "..." } en caso de éxito
        if (response.data && response.data.token) {
            const receivedToken = response.data.token;
            console.log("Login exitoso. Token recibido:", receivedToken);
            
            // Simulación básica de rol y datos de usuario 
            let userRole = 'user'; 
            if (username === 'mor_2314') { 
                userRole = 'admin'; 
            }
            const userData = { username: username, role: userRole };

            // Guardar el estado en localStorage
            localStorage.setItem("isAuthenticated", true);
            localStorage.setItem("authToken", receivedToken); 
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("isAdmin", userRole === 'admin');

            // Actualizar los estados del contexto
            setIsAuthenticated(true);
            setToken(receivedToken);
            setUser(userData);
            setIsAdmin(userRole === 'admin');

            // Navegar según el rol (si lo puedes determinar)
            if (userRole === "admin") {
                navigate("/Admin/"+userData.username); // Navega al panel de administración
            } else {
                navigate("/");
            }
            return true; // Login exitoso
        } else {
            // Si no hay token en la respuesta (aunque el 200 indique éxito sin token, es un caso raro)
            console.log("Login exitoso, pero no se recibió un token.");
            return false;
        }
        } catch (error) {
        // Manejo de errores de la API (ej. 400 Bad Request por credenciales incorrectas)
        if (error.response) {
            console.error("Error en la respuesta de la API:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("No se recibió respuesta de la API:", error.request);
        } else {
            console.error("Error al configurar la petición:", error.message);
        }
        return false; // Login fallido
        }
    };

    const logout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("authToken"); 
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");

        setIsAuthenticated(false);
        setToken(null); 
        setUser(null);
        setIsAdmin(false);

        navigate("/login");
    };

    const value = {
        isAuthenticated,
        isAdmin,
        user,
        token, // Ahora también exportamos el token
        login,
        logout,
        loading,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
                <p className="text-lg font-medium">Cargando autenticación...</p>
            </div>
        );
    }
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