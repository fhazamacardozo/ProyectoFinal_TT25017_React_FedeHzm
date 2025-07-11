import { Navbar, Container } from "react-bootstrap";
import { useAuth } from "../../Context/AuthContext";

function Header() {
    const { isAuthenticated , user} = useAuth();
    return (
        <Navbar bg="dark" className="px-3" variant="dark">
            <Container fluid className="px-3">
                <Navbar.Brand className="text-white">Proyecto Talento 2025</Navbar.Brand>
                {isAuthenticated && (
                    <Navbar.Text className="text-white">Bienvenido {user.firstName} {user.lastName}</Navbar.Text>
                )}
            </Container>
        </Navbar>
    );
}

export default Header;
