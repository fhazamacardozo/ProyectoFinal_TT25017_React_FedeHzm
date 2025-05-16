import { Container, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Cart({ cartItems, setCartItems }) {
    const MySwal = withReactContent(Swal);
    // Función para eliminar un producto del carrito
    const removeFromCart = (itemId) => {
        MySwal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                setCartItems(cartItems.filter(item => item.id !== itemId));
                const removedItem = cartItems.find(item => item.id === itemId); 
                if (removedItem) {
                    MySwal.fire({
                        title: "Producto eliminado del carrito",
                        text: `${removedItem.title} ha sido eliminado de tu carrito.`,
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#3085d6"
                    });
                }
            }
        });
    };

    const clearCart = () => {
        MySwal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, vaciar carrito!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                setCartItems([]);;
            }
        });
    };
    if (cartItems.length === 0) {
        return (
            <Container className="py-5">
                <h2 className="text-info text-center">Tu carrito está vacío</h2>
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
// Función para calcular el total del carrito
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export default Cart;