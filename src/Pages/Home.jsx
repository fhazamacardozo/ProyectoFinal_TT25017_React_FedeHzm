import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaReact, FaBootstrap, FaAtom } from 'react-icons/fa';
import { IoLogoJavascript, IoLogoFirebase } from 'react-icons/io5'; 
import { MdSecurity } from 'react-icons/md'; 
import {PiHeadCircuit} from 'react-icons/pi';
import { SiReactrouter } from "react-icons/si";
import { TiTick } from "react-icons/ti";
import {Title, Meta} from 'react-head'; 
import { useAuth } from '../Context/AuthContext';
import { useRequireAuthAction } from '../Hooks/useRequireAuthAction';

function Home() {
    // Hook para verificar si el usuario está autenticado
    const { isAuthenticated } = useAuth();
    
    const navigate = useNavigate();
    const requireAuthAction = useRequireAuthAction(isAuthenticated);
    const handleGoToCart = () => {
        requireAuthAction(() => navigate('/Cart'));
    };
    return (
        <Container className="my-5">
            <Title>E-commerce Demo - Inicio</Title> {/* <-- Usar Title */}
            <Meta name="description" content="Bienvenido al E-commerce Demo. Explora nuestro catálogo de productos, gestiona tu carrito y descubre funciones de administración." /> {/* <-- Usar Meta */}
            <Meta name="keywords" content="e-commerce, demo, react, tienda online, catálogo, carrito de compras, administración" />
            <Meta property="og:title" content="E-commerce Demo - Inicio" />
            <Meta property="og:description" content="Explora nuestra tienda demo construida con React y Bootstrap." />
            <Meta property="og:type" content="website" />

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

           {/* Technologies Used */}
            <Row className="mb-5">
                <Col xs={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h2" className="text-secondary mb-3">Tecnologías Utilizadas</Card.Title>
                            <Row className="text-center d-flex align-items-stretch g-3 row-cols-1 row-cols-sm-2 row-cols-md-4"> 
                                <Col>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <FaReact size={40} className="text-info mb-2" />
                                        <p className="fw-bold mb-0">React.js</p>
                                        <small className="text-muted">Librería de UI</small>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <IoLogoJavascript size={40} className="text-warning mb-2" />
                                        <p className="fw-bold mb-0">JavaScript ES6+</p>
                                        <small className="text-muted">Lenguaje de Programación</small>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <FaBootstrap size={40} className="text-primary mb-2" /> 
                                        <p className="fw-bold mb-0">React-Bootstrap</p>
                                        <small className="text-muted">Framework de UI</small>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <IoLogoFirebase size={40} className="text-orange mb-2" /> 
                                        <p className="fw-bold mb-0">Firebase/Firestore</p>
                                        <small className="text-muted">Backend as a Service</small>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <PiHeadCircuit size={40} className="text-purple mb-2" /> 
                                        <p className="fw-bold mb-0">React Head</p> 
                                        <small className="text-muted">SEO y Meta Tags</small>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <FaAtom size={40} style={{ color: '#e61e64' }} className=" mb-2" />
                                        <p className="fw-bold mb-0">React Icons</p>
                                        <small className="text-muted">Iconos SVG</small>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <SiReactrouter size={40} className="text-danger mb-2" />
                                        <p className="fw-bold mb-0">React Router</p>
                                        <small className="text-muted">Enrutamiento</small>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                        <TiTick size={40} className="text-success mb-2" />
                                        <p className="fw-bold mb-0">SweetAlert2</p>
                                        <small className="text-muted">Alertas y Notificaciones</small>
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
                                <li>Manejo de estados con Hooks (useState, useEffect, useContext).</li>
                                <li>Creación de Hooks personalizados para lógica reutilizable (useProductManagement).</li>
                                <li>Componentización y modularización de la interfaz de usuario.</li>
                                <li>Enrutamiento con react-router-dom.</li>
                                <li>Integración con una base de datos NoSQL (Firestore) para persistencia de datos.</li>
                                <li>Autenticación de usuarios y protección de rutas.</li>
                                <li>Implementación de funciones de búsqueda, filtrado y ordenamiento dinámicas.</li>
                                <li>Diseño responsivo utilizando Bootstrap para una experiencia de usuario adaptable.</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Authentication and Admin Credentials */}
            <Row className="mb-5">
                <Col xs={12}>
                    <Card className="shadow-sm border-primary"> 
                        <Card.Body>
                            <Card.Title as="h2" className="text-primary mb-3 d-flex align-items-center">
                                <MdSecurity size={30} className="me-2" />
                                Autenticación y Administración de Usuarios
                            </Card.Title>
                            <Card.Text>
                                Este proyecto incorpora un sistema de autenticación de usuarios robusto utilizando <strong>Firebase Authentication (basado en correo electrónico y contraseña)</strong>.
                                Esto permite a los usuarios <strong>registrarse</strong> con nuevas cuentas y <strong>iniciar sesión</strong> para acceder a diferentes funcionalidades.
                            </Card.Text>
                            <Card.Text className="mb-3">
                                Para probar la sección de <strong>Administración de Productos (ABM)</strong>, que permite agregar, editar y eliminar productos, puedes utilizar las siguientes credenciales de administrador:
                            </Card.Text>
                            <div className="bg-light p-3 rounded mb-3 border"> 
                                <p className="mb-1"><strong>Email:</strong> <code>admin@admin.com</code></p>
                                <p className="mb-0"><strong>Contraseña:</strong> <code>adminadmin</code></p>
                            </div>
                            <Card.Text className="small text-muted">
                                * Una vez iniciada sesión con estas credenciales, tendrás acceso a las funcionalidades de ABM.
                                Puedes cerrar sesión en cualquier momento y registrarte como un usuario normal para explorar la experiencia de compra.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Navigation Links  */}
            <Row className="mt-4 justify-content-center g-3">
                <Col xs={12} sm={6} md={4} className="text-center">
                    <Link to="/Catalogue" className="btn btn-primary btn-lg w-75">
                        Ir al Catálogo
                    </Link>
                </Col>
                <Col xs={12} sm={6} md={4} className="text-center">
                    <button className="btn btn-info btn-lg w-75" onClick={handleGoToCart}>
                        Ir al Carrito
                    </button>
                </Col>
                { !isAuthenticated && (
                <Col xs={12} sm={6} md={4} className="text-center">
                    <Link to="/Login" className="btn btn-success btn-lg w-75">
                        Iniciar Sesión / Registrarse
                    </Link>
                </Col>
                )}
            </Row>
        </Container>
    );
}

export default Home;