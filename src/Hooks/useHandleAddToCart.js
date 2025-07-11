import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

/**
 * Custom hook to handle add to cart logic with authentication and login prompt.
 * @param {function} addToCart - Function to add item to cart
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @param {function} [onHide] - Optional function to close modal/dialog
 * @returns {function} handleAddToCart(item)
 */
export function useHandleAddToCart(addToCart, isAuthenticated, onHide) {
    const navigate = useNavigate();

    return (item) => {
        if (isAuthenticated) {
        addToCart(item);
        if (onHide) onHide();
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
}
