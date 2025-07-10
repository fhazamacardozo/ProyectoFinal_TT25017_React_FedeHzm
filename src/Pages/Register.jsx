//Register.jsx simple form to register a new user with username,first name, last name, email and password 
// using React, Bootstrap, and SweetAlert2 for notifications and my firebase register function.
import { Container, Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";

function Register() {
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const username = e.target.username.value;
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        const registerSuccess = await register(email, password, username, firstName, lastName);

        setIsLoading(false);

        if (!registerSuccess) {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: "Error",
                text: "Error al registrar el usuario",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        } else {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: "Éxito",
                text: "Usuario registrado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <Container className="py-4">
            <h1 className="text-center">Registro</h1>
            <Form onSubmit={handleSubmit} className="w-50 mx-auto">
                <Form.Group controlId="formBasicUsername" className="mb-3">
                    <Form.Label>Nombre de usuario</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" name="username" required />
                </Form.Group>
                
                <Form.Group controlId="formBasicFirstName" className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" name="firstName" required />
                </Form.Group>

                <Form.Group controlId="formBasicLastName" className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" name="lastName" required />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" required />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" required />
                </Form.Group>
                <Button className="mt-3" variant="primary" type="submit" disabled={isLoading}>
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
                        "Registrarse"
                    )}
                </Button>
            </Form>
        </Container>
    );
}
export default Register;