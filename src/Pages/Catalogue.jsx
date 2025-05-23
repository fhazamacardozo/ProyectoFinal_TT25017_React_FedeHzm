import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import CardList from "../Components/CardList";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
function Catalogue({setCartItems, cartItems}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const MySwal = withReactContent(Swal);
    //Load items from FakeStoreAPI
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
    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setError("Error fetching items: ", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center">Cargando...</div>;
    }
    
    if (error) {
        return (
            <div className="text-center">
                <h2 className="text-danger">Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
    <Container fluid className="py-4 bg-light">
        <header className="text-center mb-4">
            <h1 className="display-5 fw-bold">Catálogo de Productos</h1>
            <p className="lead text-muted">Explora nuestros productos destacados.</p>
        </header>

        <section className="mb-5">
            <h2 className="text-primary mb-4 text-center">Productos</h2>
            <CardList items={items} buttonText="Agregar al carrito" onClick_={addToCart} />
        </section>

    </Container>
);
}

export default Catalogue;