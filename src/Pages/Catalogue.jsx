import { useState, useContext, } from "react";
import { Container } from "react-bootstrap";
import CardList from "../Components/CardList";
import { CartContext } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext"; 
import { useProductManagement } from "../Hooks/useProductManagement";
import ProductDetailModal from "../Components/ProductDetailModal";

function Catalogue() {
    const { products, isLoading, error } = useProductManagement();

    const { isAuthenticated } = useAuth();
    const { addToCart } = useContext(CartContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);


    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    if (isLoading) {
        return (
            <Container fluid className="py-4 bg-light text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando productos...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="py-4 bg-light text-center">
                <h2 className="text-danger">Error al cargar</h2>
                <p>{error}</p>
            </Container>
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
                <CardList 
                    items={products} 
                    buttonText="Ver Detalles"
                    onClick_={handleOpenModal}
                />
            </section>

           {/* Product Detail Modal */}
            <ProductDetailModal
                show={isModalOpen}
                onHide={handleCloseModal}
                selectedItem={selectedItem}
                addToCart={addToCart}
                isAuthenticated={isAuthenticated}
            />
        </Container>
    );
}

export default Catalogue;