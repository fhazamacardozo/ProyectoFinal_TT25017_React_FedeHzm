import { useContext } from "react";
import { Container, Table, Button, Row, Col, Card } from "react-bootstrap";
import { CartContext } from "../Context/CartContext";
import { FaTrash, FaShoppingCart } from "react-icons/fa"; 
import { Link } from 'react-router-dom';
import { Title, Meta } from 'react-head';
function Cart() {
    const { cartItems = [], removeFromCart, clearCart, calculateTotal } = useContext(CartContext);

    // Si el carrito está vacío
    if (cartItems.length === 0) {
        return (
            <Container className="py-5 text-center">
                <Title>Tu Carrito de Compras - E-commerce Demo</Title>
                <Meta name="description" content="Revisa los productos en tu carrito de compras y procede al pago." />
                <Meta name="keywords" content="carrito, compras, online, checkout, pagar" />
    
                <h2 className="text-primary mb-4">Tu Carrito de Compras</h2>
                <FaShoppingCart size={80} className="text-muted mb-3" />
                <p className="lead text-muted">¡Tu carrito está vacío! Explora nuestro catálogo para llenarlo.</p>
                <Link to="/Catalogue" className="btn btn-primary mt-3">
                    Ir al Catálogo
                </Link>
            </Container>
        );
    }

    // Si el carrito tiene productos
    return (
        <Container className="py-5">
            <Title>Tu Carrito de Compras - E-commerce Demo</Title>
            <Meta name="description" content="Revisa los productos en tu carrito de compras y procede al pago." />
            <Meta name="keywords" content="carrito, compras, online, checkout, pagar" />
            <h1 className="text-primary mb-4 text-center">Tu Carrito de Compras</h1>

            {/* Vista de tabla para pantallas grandes (md y arriba) */}
            <div className="d-none d-md-block"> 
                <Table striped bordered hover responsive className="shadow-sm"> 
                    <thead className="table-light"> 
                        <tr>
                            <th>Producto</th>
                            <th className="text-center">Precio Unitario</th>
                            <th className="text-center">Cantidad</th>
                            <th className="text-end">Subtotal</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td className="align-middle">
                                    <div className="d-flex align-items-center">
                                        <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px', borderRadius: '5px' }} />
                                        <span>{item.title}</span>
                                    </div>
                                </td>
                                <td className="text-center align-middle">${item.price.toFixed(2)}</td>
                                <td className="text-center align-middle">{item.quantity}</td>
                                <td className="text-end align-middle">${(item.price * item.quantity).toFixed(2)}</td>
                                <td className="text-center align-middle">
                                    <Button
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => removeFromCart(item.id)}
                                        className="d-flex align-items-center justify-content-center mx-auto" 
                                    >
                                        <FaTrash className="me-1" /> Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Vista de lista de tarjetas para pantallas pequeñas (xs a sm) */}
            <div className="d-md-none"> 
                <Row className="g-3"> 
                    {cartItems.map(item => (
                        <Col xs={12} key={item.id}> 
                            <Card className="shadow-sm">
                                <Card.Body className="d-flex align-items-center">
                                    <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'contain', marginRight: '15px', borderRadius: '5px' }} />
                                    <div className="flex-grow-1">
                                        <Card.Title as="h5" className="mb-1">{item.title}</Card.Title>
                                        <Card.Text className="mb-1">
                                            Precio Unitario: <strong className="text-primary">${item.price.toFixed(2)}</strong>
                                        </Card.Text>
                                        <Card.Text className="mb-1">
                                            Cantidad: <strong>{item.quantity}</strong>
                                        </Card.Text>
                                        <Card.Text className="fw-bold fs-5 text-end">
                                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                        </Card.Text>
                                    </div>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeFromCart(item.id)}
                                        className="ms-3" 
                                    >
                                        <FaTrash />
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Sección de Total y Botones de Acción */}
            <Card className="mt-4 shadow-lg border-0"> 
                <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <Button variant="outline-warning" onClick={clearCart} className="mb-3 mb-md-0 me-md-3">
                        <FaTrash className="me-2" /> Vaciar Carrito
                    </Button>
                    <div className="text-center text-md-end">
                        <h4 className="mb-0">
                            Total: <strong className="text-success">${calculateTotal(cartItems).toFixed(2)}</strong>
                        </h4>
                        <Button variant="success" className="mt-3">
                            Proceder al Pago
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Cart;