import { Container, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useContext } from "react";
import { CartContext } from "../Context/CartContext";

function Cart() {
    const {cartItems = [], removeFromCart, clearCart, calculateTotal} = useContext(CartContext);
    if (cartItems.length === 0) {
        return (
            <Container className="py-5">
                <h2 className="text-info mb-4">Tu Carrito de Compras</h2>
                <p>No hay productos en tu carrito.</p>
            </Container>
        );
    }
    return (
        <Container className="py-5">
            <h2 className="text-info mb-4">Tu Carrito de Compras</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>${item.price}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                                Eliminar
                            </Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="mt-3 d-flex justify-content-between align-items-center">
                <Button variant="warning" onClick={clearCart}>
                    Vaciar Carrito
                </Button>
                <div>
                    <strong>Total:</strong> ${calculateTotal(cartItems).toFixed(2)}
                </div>
            </div>
        </Container>
    );
};

export default Cart;