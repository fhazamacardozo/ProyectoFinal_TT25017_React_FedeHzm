import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { FaShoppingCart, FaUserCircle, FaHome, FaThList, FaUserShield } from "react-icons/fa";
function NavBar() {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();
    const location = useLocation();
    const isActive = (path) => {
        // Para rutas exactas y rutas con parámetros
        if (path === '/') return location.pathname === '/';
        if (path.includes(':')) return location.pathname.startsWith(path.split(':')[0]);
        return location.pathname === path;
    };
    
    return (
        <Navbar bg="dark" variant="dark" expand="md" className="shadow-sm py-2">
            <Container fluid>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="me-auto align-items gap-2 flex-md-row flex-column">
                        <Nav.Link as={Link} to="/" className={`fw-semibold d-flex align-items-center gap-1 ${isActive('/') ? 'bg-info text-dark rounded px-3 py-1' : 'text-white'}`}>
                            <FaHome size={18} /> Inicio
                        </Nav.Link>
                        <Nav.Link as={Link} to="/Catalogue" className={`fw-semibold d-flex align-items-center gap-1 ${isActive('/Catalogue') ? 'bg-info text-dark rounded px-3 py-1' : 'text-white'}`}>
                            <FaThList size={18} /> Catálogo
                        </Nav.Link>
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/Cart" className={`fw-semibold d-flex align-items-center gap-1 ${isActive('/Cart') ? 'bg-info text-dark rounded px-3 py-1' : 'text-white'}`}>
                                <FaShoppingCart size={18} /> Carrito
                            </Nav.Link>
                        )}
                        {isAuthenticated && isAdmin && (
                            <>
                                <Nav.Link as={Link} to={`/Admin/${user.username}`} className={`fw-semibold d-flex align-items-center gap-1 ${isActive(`/Admin/${user.username}`) ? 'bg-info text-dark rounded px-3 py-1' : 'text-white'}`}>
                                    <FaUserShield size={18} /> Admin
                                </Nav.Link>
                                <Nav.Link as={Link} to="/ProductManager" className={`fw-semibold d-flex align-items-center gap-1 ${isActive('/ProductManager') ? 'bg-info text-dark rounded px-3 py-1' : 'text-white'}`}>
                                    <FaThList size={18} /> Gestor
                                </Nav.Link>
                            </>
                        )}
                        {!isAuthenticated && (
                            <Nav.Link as={Link} to="/Login" className={`fw-semibold ${isActive('/Login') ? 'bg-info text-dark rounded px-3 py-1' : 'text-white'}`}>Ingresar</Nav.Link>
                        )}
                    </Nav>
                    {isAuthenticated && (
                        <Button
                            variant="outline-light"
                            size="sm"
                            className="ms-2 d-block mx-auto mx-md-0 mt-2 mt-md-0"
                            onClick={logout}
                        >
                            Cerrar Sesión
                        </Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default NavBar;
