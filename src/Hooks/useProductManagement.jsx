import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
    getProductsFromDb,
    addProductToDb,
    updateProductInDb,
    deleteProductFromDb,
    addProductsFromJsonToDb, 
} from '../Services/ProductService.jsx';


const MySwal = withReactContent(Swal); // Instancia de SweetAlert2

export const useProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [isSaving, setIsSaving] = useState(false); // Para spinner de guardado
    const [isLoading, setIsLoading] = useState(true); // Carga inicial de la tabla
    const [isDeletingId, setIsDeletingId] = useState(null); // Para spinner de eliminación
    const [jsonUploadFeedback, setJsonUploadFeedback] = useState({ message: '', type: '' });
    const [isUploadingJson, setIsUploadingJson] = useState(false); // Para el spinner del modal JSON
    const [error, setError] = useState(null); 

    // --- Lógica para obtener productos (useEffect) ---
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Resetea el error antes de la carga
        try {
            const fetchedProducts = await getProductsFromDb();
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            MySwal.fire({
                title: "Error",
                text: "No se pudieron cargar los productos.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            setError("Error al obtener productos:",error); 
        } finally {
            setIsLoading(false);
        }
    }, []); // No tiene dependencias, solo se crea una vez

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // Se ejecuta al montar el componente o si fetchProducts cambia (que no debería)

    // --- Lógica para añadir producto ---
    const addProduct = async (productData) => {
        setIsSaving(true); // Puede ser un spinner global o de la operación
        try {
            await addProductToDb(productData);
            await fetchProducts(); // Recargar la lista
            MySwal.fire({
                title: "Éxito",
                text: "Producto agregado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            return true;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            MySwal.fire({
                title: "Error",
                text: "Error al agregar el producto.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    // --- Lógica para actualizar producto ---
    const updateProduct = async (id, productData) => {
        setIsSaving(true); // Puede ser un spinner global o de la operación
        try {
            await updateProductInDb(id, productData);
            await fetchProducts(); // Recargar la lista
            MySwal.fire({
                title: "Éxito",
                text: "Producto actualizado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            return true;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            MySwal.fire({
                title: "Error",
                text: "Error al actualizar el producto.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    // --- Lógica para eliminar producto ---
    const deleteProduct = async (id) => {
        const result = await MySwal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            setIsDeletingId(id);
            try {
                await deleteProductFromDb(id);
                await fetchProducts();
                MySwal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                MySwal.fire("Error", "No se pudo eliminar el producto.", "error");
            } finally {
                setIsDeletingId(null);
            }
        }
    };

    // --- Lógica para cargar productos desde JSON ---
    const uploadProductsFromJson = async (loadedProducts) => {
        setIsUploadingJson(true);
        setJsonUploadFeedback({ message: '', type: '' });

        try {
            const { uploadedCount, failedCount, errors } = await addProductsFromJsonToDb(loadedProducts);

            if (failedCount > 0) {
                setJsonUploadFeedback({
                    message: `Se subieron ${uploadedCount} producto(s) con éxito, pero ${failedCount} fallaron.`,
                    type: 'warning'
                });
                console.error("Detalles de errores en la subida JSON:", errors);
            } else {
                setJsonUploadFeedback({
                    message: `¡Éxito! Se subieron ${uploadedCount} producto(s) correctamente.`,
                    type: 'success'
                });
            }
            await fetchProducts(); // Recargar la lista de productos en la tabla
            return { uploadedCount, failedCount, errors }; // Devuelve los resultados para que el modal los use si quiere
        } catch (error) {
            console.error("Error al cargar productos desde JSON:", error);
            setJsonUploadFeedback({
                message: `Error grave al procesar el archivo JSON: ${error.message}`,
                type: 'danger'
            });
            return { uploadedCount: 0, failedCount: loadedProducts.length, errors: [{ message: error.message }] };
        } finally {
            setIsUploadingJson(false);
        }
    };

    return {
        products,
        isLoading,
        error,
        isSaving,
        isDeletingId,
        jsonUploadFeedback,
        isUploadingJson,
        fetchProducts, // aunque el useEffect ya lo llama, puede ser útil si quieres refetch manual
        addProduct,
        updateProduct,
        deleteProduct,
        uploadProductsFromJson,
        setJsonUploadFeedback // Permite al componente padre resetear el feedback si lo necesita
    };
};