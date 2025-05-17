import {Navigate} from "react-router-dom";

function ProtecterdUserRoute({children}) { 
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }
    return children;
}
export default ProtecterdUserRoute;
