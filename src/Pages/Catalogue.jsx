import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import CardList from "../Components/CardList";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CartContext } from "../Context/CartContext";
import { useContext } from "react";
function Catalogue() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const MySwal = withReactContent(Swal);
    const { addToCart } = useContext(CartContext);
    //Load items from FakeStoreAPI

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