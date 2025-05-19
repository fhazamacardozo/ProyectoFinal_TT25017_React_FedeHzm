import {Navigate} from "react-router-dom";

function ProtectedUserRoute({children}) { 
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }
    return children;
}
export default ProtectedUserRoute;
