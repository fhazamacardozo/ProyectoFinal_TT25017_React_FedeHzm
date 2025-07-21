import { useState, useEffect } from "react";
import { CartContext } from "./CartContextDef";
import { useAuth } from "./AuthContext";
import { db } from "../FireBaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);
    const [addingToCartId, setAddingToCartId] = useState(null);
    const { user } = useAuth();
    const MySwal = withReactContent(Swal);

    // Load cart from Firestore when user changes
    useEffect(() => {
        const fetchCart = async () => {
            setCartLoading(true);
            if (user && user.uid) {
                try {
                    const cartDoc = await getDoc(doc(db, "carts", user.uid));
                    if (cartDoc.exists()) {
                        setCartItems(cartDoc.data().items || []);
                    } else {
                        setCartItems([]);
                    }
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            } else {
                setCartItems([]);
            }
            setCartLoading(false);
        };
        fetchCart();
    }, [user]);

    // Helper to sync cart to Firestore
    const syncCartToFirestore = async (items) => {
        if (user && user.uid) {
            setCartLoading(true);
            try {
                await setDoc(doc(db, "carts", user.uid), { items });
            } catch (error) {
                console.error("Error updating cart in Firestore:", error);
            }
            setCartLoading(false);
        }
    };

    const addToCart = async (item) => {
        setAddingToCartId(item.id);
        setCartLoading(true);
        let updatedItems;
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            updatedItems = cartItems.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        } else {
            updatedItems = [...cartItems, { ...item, quantity: 1 }];
        }
        setCartItems(updatedItems);
        await syncCartToFirestore(updatedItems);
        toast.success(`${item.title} ha sido agregado a tu carrito.`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setCartLoading(false);
        setAddingToCartId(null);
    };

    const removeFromCart = async (itemId) => {
        MySwal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setCartLoading(true);
                const updatedItems = cartItems.filter(item => item.id !== itemId);
                setCartItems(updatedItems);
                await syncCartToFirestore(updatedItems);
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
                setCartLoading(false);
            }
        });
    };

    const clearCart = async () => {
        MySwal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, vaciar carrito!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setCartLoading(true);
                setCartItems([]);
                await syncCartToFirestore([]);
                setCartLoading(false);
            }
        });
    };

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, calculateTotal, cartLoading, addingToCartId }}>
            {children}
        </CartContext.Provider>
    );
}