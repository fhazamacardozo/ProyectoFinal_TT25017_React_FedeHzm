import { Navbar, Container } from "react-bootstrap";
import { FaReact, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";

function Header() {
    const { isAuthenticated, user } = useAuth();
    return (
        <Navbar bg="dark" variant="dark" className="shadow-sm py-2">
            <Container fluid className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                    <FaReact size={28} className="text-info" />
                    <span className="text-white fw-bold fs-4">E-commerce Demo</span>
                </div>
                {isAuthenticated && (
                    <div className="d-flex align-items-center gap-2 text-white">
                        <FaUserCircle size={22} className="text-secondary" />
                        <span className="fw-semibold">{user.firstName} {user.lastName}</span>
                    </div>
                )}
            </Container>
        </Navbar>
    );
}

export default Header;
