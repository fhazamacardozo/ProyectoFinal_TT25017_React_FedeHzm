import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

/**
 * Hook para proteger acciones que requieren autenticación.
 * Si el usuario no está autenticado, muestra un SweetAlert y redirige a login si confirma.
 * @param {boolean} isAuthenticated
 * @returns {function} requireAuthAction(callback)
 */
export function useRequireAuthAction(isAuthenticated) {
    const navigate = useNavigate();
    return async (callback) => {
        if (isAuthenticated) {
            if (callback) callback();
        } else {
            const result = await MySwal.fire({
                title: 'Inicia sesión para continuar',
                text: 'Debes iniciar sesión para acceder a esta función.',
                icon: 'warning',
                confirmButtonText: 'Iniciar Sesión',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
            });
            if (result.isConfirmed) {
                navigate('/login');
            }
        }
    };
}
