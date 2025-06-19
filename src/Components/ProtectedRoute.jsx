import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Componente genérico para rutas protegidas
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Si no está autenticado, redirige al login
        return <Navigate to="/login" />;
    }

    // Si está autenticado, renderiza el componente hijo
    return children ? children : <Outlet />;
};

// Componente específico para rutas de administrador
export const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated) {
            // Si no está autenticado, redirige al login
            return <Navigate to="/login" />;
        }
    if (!isAuthenticated || !isAdmin) {
        // Si no es un admin autenticado, redirige al home o a una página de "no autorizado"
        return <Navigate to="/" />;
    }

    return children ? children : <Outlet />;
};