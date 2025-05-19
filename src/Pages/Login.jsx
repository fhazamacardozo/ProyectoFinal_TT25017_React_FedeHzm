//Login Component
// This component is used to display the login page.
// It contains a form with username and password fields.
// It uses local storage to store the authentication status.
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Login() {
    const navigate = useNavigate();
    const handleLogin = () => {
        // Simulate login action
        localStorage.setItem("isAuthenticated", true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        // Simulate authentication
        if (username === "admin" && password === "admin") {
            handleLogin();
            localStorage.setItem("isAdmin", true);
            navigate("/Admin/peperro");
        } else if (username === "user" && password === "user") {
            handleLogin();
            localStorage.setItem("isAdmin", false);
            navigate("/");
        } else {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: "Error",
                text: "Usuario o contraseña incorrectos",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <Container className="py-4">
            <h1 className="text-center">Login</h1>
            <Form onSubmit={handleSubmit} className="w-50 mx-auto">
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" name="username" required />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" required />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}
export default Login;