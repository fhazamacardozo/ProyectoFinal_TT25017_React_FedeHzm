
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaReact, FaBootstrap } from 'react-icons/fa';
import { IoLogoJavascript, IoLogoFirebase } from 'react-icons/io5'; // More icons

function Home() {
    return (
        <Container className="my-5">
            {/* Título Principal y Descripción - Centrado y ancho limitado en grandes pantallas */}
            <Row className="justify-content-center mb-5">
                <Col xs={12} md={10} lg={8} className="text-center"> 
                    <h1 className="display-4 fw-bold text-primary mb-3">Bienvenido a Nuestro E-commerce Demo</h1>
                    <p className="lead text-muted">
                        Explora un catálogo de productos interactivo, gestiona tu carrito de compras y descubre la administración de productos.
                    </p>
                </Col>
            </Row>

            {/* Project Overview */}
            <Row className="mb-5">
                <Col xs={12}> {/* xs=12 para que la tarjeta ocupe todo el ancho en móviles */}
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h2" className="text-secondary mb-3">Acerca de este Proyecto</Card.Title>
                            <Card.Text>
                                Este es un proyecto de demostración de un e-commerce, desarrollado con fines educativos y de práctica.
                                Simula las funcionalidades básicas de una tienda en línea, incluyendo la visualización de un catálogo de productos,
                                un sistema de carrito de compras y una sección de administración de productos (ABM) para usuarios autorizados.
                                <br/><br/>
                                El objetivo principal fue poner en práctica conceptos de desarrollo front-end moderno, gestión de estado,
                                interacción con APIs (simuladas a través de Firebase/Firestore) y autenticación de usuarios.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Technologies Used - REFINED SECTION */}
            <Row className="mb-5">
                <Col xs={12}> 
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h2" className="text-secondary mb-3">Tecnologías Utilizadas</Card.Title>
                            <Row className="text-center d-flex align-items-stretch g-3">
                                <Col xs={12} sm={6} md={3}> 
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <FaReact size={40} className="text-info mb-2" />
                                        <p className="fw-bold mb-0">React.js</p>
                                        <small className="text-muted">Librería de UI</small>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6} md={3}>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <IoLogoJavascript size={40} className="text-warning mb-2" />
                                        <p className="fw-bold mb-0">JavaScript ES6+</p>
                                        <small className="text-muted">Lenguaje de Programación</small>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6} md={3}>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <FaBootstrap size={40} className="text-purple mb-2" />
                                        <p className="fw-bold mb-0">React-Bootstrap</p>
                                        <small className="text-muted">Framework de UI</small>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6} md={3}>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <IoLogoFirebase size={40} className="text-orange mb-2" />
                                        <p className="fw-bold mb-0">Firebase/Firestore</p>
                                        <small className="text-muted">Backend as a Service</small>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Context of Realization */}
            <Row className="mb-5">
                <Col xs={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h2" className="text-secondary mb-3">Contexto de Realización</Card.Title>
                            <Card.Text>
                                Este proyecto fue desarrollado como parte de un curso/bootcamp de desarrollo web full-stack
                                para aplicar conocimientos sobre:
                            </Card.Text>
                            <ul>
                                <li>Manejo de estados con Hooks (`useState`, `useEffect`, `useContext`).</li>
                                <li>Creación de Hooks personalizados para lógica reutilizable (`useProductManagement`).</li>
                                <li>Componentización y modularización de la interfaz de usuario.</li>
                                <li>Enrutamiento con `react-router-dom`.</li>
                                <li>Integración con una base de datos NoSQL (Firestore) para persistencia de datos.</li>
                                <li>Autenticación de usuarios y protección de rutas.</li>
                                <li>Implementación de funciones de búsqueda, filtrado y ordenamiento dinámicas.</li>
                                <li>Diseño responsivo utilizando Bootstrap para una experiencia de usuario adaptable.</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Admin Credentials */}
            <Row className="mb-5">
                <Col xs={12}> 
                    <Card className="shadow-sm border-warning">
                        <Card.Body>
                            <Card.Title as="h2" className="text-danger mb-3">Credenciales de Acceso para Administración (ABM)</Card.Title>
                            <Card.Text>
                                Para acceder a la sección de Administración de Productos (ABM) y probar las funciones de
                                agregar, editar y eliminar productos, utiliza las siguientes credenciales:
                                <br/><br/>
                                <strong>Email:</strong> <code>admin@admin.com</code><br/>
                                <strong>Contraseña:</strong> <code>adminadmin</code>
                                <br/><br/>
                                Una vez iniciada sesión con estas credenciales, podrás ver y acceder a la sección de ABM
                                de productos.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Navigation Links - Ajuste para botones en móviles */}
            <Row className="mt-4 justify-content-center g-3">
                <Col xs={12} sm={6} md={4} className="text-center">
                    <Link to="/Catalogue" className="btn btn-primary btn-lg w-75">
                        Ir al Catálogo
                    </Link>
                </Col>
                <Col xs={12} sm={6} md={4} className="text-center"> 
                    <Link to="/Cart" className="btn btn-info btn-lg w-75">
                        Ir al Carrito
                    </Link>
                </Col>
                <Col xs={12} sm={6} md={4} className="text-center">
                    <Link to="/Login" className="btn btn-success btn-lg w-75">
                        Iniciar Sesión / Registrarse
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;