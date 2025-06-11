import { createContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const MySwal = withReactContent(Swal);

    const addToCart = (item) => {
            const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
            setCartItems(cartItems.map(cartItem =>
                cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ));
            } 
            else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
            }
            MySwal.fire({
                title: "Producto agregado al carrito",
                text: `${item.title} ha sido agregado a tu carrito.`,
                icon: "success",
            });
        };

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

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
}