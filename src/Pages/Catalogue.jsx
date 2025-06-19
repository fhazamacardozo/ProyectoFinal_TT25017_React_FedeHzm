import { useState, useEffect, useContext } from "react";
import { Container } from "react-bootstrap";
import CardList from "../Components/CardList";
// IMPORTAR MODAL DE REACT-BOOTSTRAP
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'; 
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CartContext } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext"; 
import { useNavigate } from "react-router-dom";

function Catalogue() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const MySwal = withReactContent(Swal);
    const { addToCart } = useContext(CartContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setError("Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.", error);
                setLoading(false);
            });
    }, []);

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleAddToCartFromModal = (item) => {
        addToCart(item);
        handleCloseModal();
    };

    // Function to render stars based on rating 
    const renderStars = (rate) => {
        const fullStars = Math.floor(rate);
        const halfStar = rate % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} style={{ color: '#FFD700' }}>&#9733;</span>); // Full star
        }
        if (halfStar) {
            stars.push(<span key="half" style={{ color: '#FFD700', opacity: 0.5 }}>&#9733;</span>); // Half star
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} style={{ color: '#ccc' }}>&#9734;</span>); // Empty star
        }
        return stars;
    };


    if (loading) {
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
                    items={items} 
                    buttonText="Ver Detalles"
                    onClick_={handleOpenModal}
                />
            </section>

            {/* React Bootstrap Modal */}
            <Modal show={isModalOpen} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedItem?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <div className="text-center"> 
                            <div style={{ 
                                width: '200px', 
                                height: '200px', 
                                margin: '0 auto 20px auto', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                overflow: 'hidden'
                            }}>
                                <img 
                                    src={selectedItem.image} 
                                    alt={selectedItem.title} 
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                />
                            </div>
                            <p style={{ textAlign: 'left', marginBottom: '15px' }}>{selectedItem.description}</p>
                            <p className="lead fw-bold text-success">${selectedItem.price}</p>
                            <p className="text-muted fst-italic">Categoría: {selectedItem.category}</p>
                            <div className="d-flex justify-content-center align-items-center mb-3">
                                Valoración: {selectedItem.rating.rate} ({selectedItem.rating.count}) - {renderStars(selectedItem.rating.rate)}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    {isAuthenticated && (
                    <Button variant="primary" onClick={() => handleAddToCartFromModal(selectedItem)}>
                        Agregar al carrito
                    </Button>
                    )}
                    {!isAuthenticated && (
                        <Button variant="warning" onClick={() => {
                            MySwal.fire({
                                title: 'Inicia sesión para agregar al carrito',
                                text: 'Por favor, inicia sesión para poder agregar productos al carrito.',
                                icon: 'warning',
                                confirmButtonText: 'Iniciar Sesión',
                                cancelButtonText: 'Cancelar',
                                showCancelButton: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate('/login');
                                }
                            });
                        }}>
                            Iniciar Sesión
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Catalogue;