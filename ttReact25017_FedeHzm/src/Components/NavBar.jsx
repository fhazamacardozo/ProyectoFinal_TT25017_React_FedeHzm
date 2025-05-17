/*This NavBar component is used to display the navigation bar of the application.
It contains links to different pages.
It uses the 'Link' component from 'react-router-dom' to create client-side navigation.
*/

import { Nav, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/Login");
    };
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Mi Sitio</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/Catalogue">Catalogue</Nav.Link>
                        {isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/Cart">Cart</Nav.Link>
                                <Nav.Link as={Link} to="/Admin/peperro">Admin</Nav.Link>
                            </>
                        )}
                        <Nav>
                            {!isAuthenticated ? (
                                <Nav.Link as={Link} to="/Login">Login</Nav.Link>
                            ) : (
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            )}
                        </Nav>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default NavBar;
