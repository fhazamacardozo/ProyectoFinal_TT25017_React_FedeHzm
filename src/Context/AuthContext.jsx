import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export function AuthProvider ({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Efecto para verificar si hay una sesión activa en localStorage al cargar la app
    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated");
        const storedAdmin = localStorage.getItem("isAdmin");
        const storedUser = localStorage.getItem("user");

        if (storedAuth === 'true' && storedUser) {
            setIsAuthenticated(true);
            setIsAdmin(storedAdmin === 'true');
            setUser(JSON.parse(storedUser));
        }
    }, []);

// Función de Login
    const login = (username, password) => {
        // Simulación de autenticación
        if (username === "admin" && password === "admin") {
            localStorage.setItem("isAuthenticated", true);
            localStorage.setItem("isAdmin", true);
            const userData = { username: 'admin', role: 'admin' };
            localStorage.setItem("user", JSON.stringify(userData));

            setIsAuthenticated(true);
            setIsAdmin(true);
            setUser(userData);

            //Navego a pagina de admin
            navigate("/Admin/peperro");
            return true; // Login exitoso

        } else if (username === "user" && password === "user") {
            localStorage.setItem("isAuthenticated", true);
            localStorage.setItem("isAdmin", false);
            const userData = { username: 'user', role: 'user' };
            localStorage.setItem("user", JSON.stringify(userData));
            
            setIsAuthenticated(true);
            setIsAdmin(false);
            setUser(userData);
            
            //Navega a home
            navigate("/");
            return true; // Login exitoso
        } else {
            return false; // Login fallido
        }
    };

    const logout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("user");

        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);

        navigate("/login");
    };

    const value = {
        isAuthenticated,
        isAdmin,
        user,
        login,
        logout
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