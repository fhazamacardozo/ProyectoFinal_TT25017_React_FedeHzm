import {Navigate} from "react-router-dom";

function ProtectedAdminRoute({children}) {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }
    else if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    return children;
}
export default ProtectedAdminRoute