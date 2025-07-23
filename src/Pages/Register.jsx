import { Container, Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import { Title, Meta } from "react-head";

function Register() {
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.username.trim()) newErrors.username = 'El nombre de usuario es obligatorio.';
        if (!form.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio.';
        if (!form.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio.';
        if (!form.email.trim()) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
            newErrors.email = 'El email no es válido.';
        }
        if (!form.password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (form.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        }
        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña.';
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true);
        const { username, firstName, lastName, email, password } = form;
        const registerSuccess = await register(email, password, username, firstName, lastName);
        setIsLoading(false);
        const MySwal = withReactContent(Swal);
        if (!registerSuccess) {
            MySwal.fire({
                title: "Error",
                text: "Error al registrar el usuario",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        } else {
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
            {/* Title and description */}
            <Title>Registro - E-commerce Demo</Title>
            <Meta name="description" content="Regístrate para acceder a todas las funcionalidades de nuestro E-commerce Demo." />
            <Meta name="keywords" content="registro, e-commerce, demo, react, tienda online" />
            <h1 className="text-center">Registro</h1>
            <Form onSubmit={handleSubmit} className="w-50 mx-auto">
                <Form.Group controlId="formBasicUsername" className="mb-3">
                    <Form.Label>Nombre de usuario</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresar nombre de usuario"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicFirstName" className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresar nombre"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicLastName" className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresar apellido"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Ingresar email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirmar contraseña"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
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
                                className="me-2"
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