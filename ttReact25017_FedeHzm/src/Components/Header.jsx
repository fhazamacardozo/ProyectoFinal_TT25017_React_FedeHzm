import { Navbar, Container } from "react-bootstrap";

function Header({type, user}) {
    const isAuth = localStorage.getItem('auth') === 'true';
    return (
        <Navbar bg="dark" className="px-3" variant="dark">
            <Container fluid className="px-3">
                <Navbar.Brand className="text-white">Proyecto Talento 2025</Navbar.Brand>
                {isAuth && (
                    <Navbar.Text className="text-white">{type}-{user}</Navbar.Text>
                )}
            </Container>
        </Navbar>
    );
}

export default Header;
