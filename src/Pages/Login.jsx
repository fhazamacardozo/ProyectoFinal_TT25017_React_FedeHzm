//Login Component
// This component is used to display the login page.
// It contains a form with username and password fields.
// It uses local storage to store the authentication status.
import { Container, Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

function Login() {
    const {login} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setIsLoading(true);
        console.log("Login form submitted");
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        const loginSuccess = await login(email, password); 
        
        setIsLoading(false);

        if (!loginSuccess) {
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
                <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" required />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" required />
                </Form.Group>

                <Button className = "mt-3" variant="primary" type="submit" disabled={isLoading}> {/* Deshabilita el botón mientras carga */}
                    {isLoading ? (
                        <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2" // Margen a la derecha del spinner
                        />
                        Cargando...
                        </>
                    ) : (
                        "Submit"
                    )}
                </Button>
                {/*Register button*/}
                <div className="mt-3 text-center">
                    <span>¿No tienes una cuenta? </span>
                    <Button variant="link" onClick={()=>{navigate('/register');}}>Regístrate aquí</Button>
                </div>
        </Form>
            </Container>
    );
}
export default Login;