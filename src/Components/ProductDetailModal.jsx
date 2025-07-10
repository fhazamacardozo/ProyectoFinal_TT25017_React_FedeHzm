import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

function ProductDetailModal({
    show,
    onHide,
    selectedItem,
    addToCart,
    isAuthenticated
}) {
    const navigate = useNavigate();

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

    const handleAddToCart = () => {
        if (isAuthenticated) {
            addToCart(selectedItem);
            onHide(); // Close modal after adding to cart
        } else {
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
        }
    };

    if (!selectedItem) {
        return null; // Don't render modal if no item is selected
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{selectedItem.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleAddToCart}>
                    Agregar al carrito
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductDetailModal;