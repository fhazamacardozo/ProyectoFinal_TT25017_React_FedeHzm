import { Nav, Navbar, Container } from "react-bootstrap";
import { Link} from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { FaShoppingCart } from "react-icons/fa";
function NavBar() {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();
    
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">E-Demo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/Catalogue">Catálogo</Nav.Link>
                        {isAuthenticated && (
                            <> 
                                <Nav.Link as={Link} to="/Cart">
                                    <FaShoppingCart />
                                    Carrito
                                </Nav.Link>
                                {isAdmin && (
                                    <> 
                                        <Nav.Link as={Link} to={`/Admin/${user.username}`}>Admin</Nav.Link>
                                        <Nav.Link as={Link} to="/ProductManager">Gestor de Productos</Nav.Link>
                                    </>
                                )}
                            </>
                        )}
                        <Nav>
                            {!isAuthenticated ? (
                                <Nav.Link as={Link} to="/Login">Ingresar</Nav.Link>
                            ) : (
                                <Nav.Link onClick={logout}>Cerrar Sesión</Nav.Link>
                            )}
                        </Nav>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default NavBar;
