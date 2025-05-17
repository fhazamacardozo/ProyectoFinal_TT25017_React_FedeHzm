import {Navigate} from "react-router-dom";

function ProtectedRoute({children}) {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }
    return children;
}
export default ProtectedRoute;