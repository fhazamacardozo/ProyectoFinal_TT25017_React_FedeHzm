// Función para registrar actividad de carga masiva de productos
export async function logProductActivityMassive(products, user, failedProducts = []) {
    try {
        // Solo productos subidos con éxito
        const productDetails = products.map(p => ({ id: p.id, title: p.title || p.name || '' }));
        const failedDetails = failedProducts.map(fp => ({ title: fp.productTitle || fp.title || '' }));
        await addDoc(collection(db, 'activity_products'), {
            products: productDetails,
            failedProducts: failedDetails,
            userId: user?.uid || '',
            userName: user?.displayName || user?.email || '',
            timestamp: serverTimestamp(),
            action: 'add-massive',
            source: 'json'
        });
    } catch (err) {
        console.error('Error registrando actividad masiva de productos:', err);
    }
}
import { useState, useEffect, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
    getProductsFromDb,
    addProductToDb,
    updateProductInDb,
    deleteProductFromDb,
    addProductsFromJsonToDb,
} from '../Services/ProductService.jsx';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../FireBaseConfig';
// Función para registrar actividad de productos agregados
export async function logProductActivity(product, user, source = "manual") {
    try {
        await addDoc(collection(db, 'activity_products'), {
            productId: product.id || null,
            productName: product.title || product.name || '',
            userId: user?.uid || '',
            userName: user?.displayName || user?.email || '',
            timestamp: serverTimestamp(),
            action: 'add',
            source
        });
    } catch (err) {
        console.error('Error registrando actividad de producto:', err);
    }
}


const MySwal = withReactContent(Swal); 

export const useProductManagement = (
    searchTerm = '',
    selectedCategories = [],
    selectedRating = 0,
    sortOption = '',
    currentPage = 1,
    pageSize = 12 // default page size
) => {
    const [allProducts, setAllProducts] = useState([]); // Store all original products
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
            setAllProducts(fetchedProducts);
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
    }, []); 

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // Se ejecuta al montar el componente o si fetchProducts cambia (que no debería)

     // --- Filtering and Sorting Logic ---
    const productsData = useMemo(() => {
        let filteredAndSortedProducts = [...allProducts];

        // 1. Search Filter
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredAndSortedProducts = filteredAndSortedProducts.filter(product =>
                product.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                product.category.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        // 2. Category Filter (multi)
        if (selectedCategories && selectedCategories.length > 0) {
            filteredAndSortedProducts = filteredAndSortedProducts.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // 3. Rating Filter
        if (selectedRating > 0) {
            filteredAndSortedProducts = filteredAndSortedProducts.filter(product =>
                product.rating.rate >= selectedRating
            );
        }

        // 4. Sorting
        if (sortOption) {
            filteredAndSortedProducts.sort((a, b) => {
                switch (sortOption) {
                    case 'name_asc':
                        return a.title.localeCompare(b.title);
                    case 'name_desc':
                        return b.title.localeCompare(a.title);
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    case 'rating_desc':
                        return b.rating.rate - a.rating.rate;
                    case 'rating_asc':
                        return a.rating.rate - b.rating.rate;
                    default:
                        return 0;
                }
            });
        }

        // Pagination logic
        const totalProducts = filteredAndSortedProducts.length;
        const totalPages = Math.ceil(totalProducts / pageSize);
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const paginatedProducts = filteredAndSortedProducts.slice(startIdx, endIdx);

        return {
            paginatedProducts,
            totalPages,
            totalProducts,
            filteredAndSortedProducts // for infinite scroll
        };
    }, [allProducts, searchTerm, selectedCategories, selectedRating, sortOption, currentPage, pageSize]);

    // Extract unique categories for the sidebar
    const categories = useMemo(() => {
        const uniqueCategories = new Set(allProducts.map(product => product.category));
        return Array.from(uniqueCategories).sort();
    }, [allProducts]);

    // --- Lógica para añadir producto ---
    const addProduct = async (productData, user) => {
        setIsSaving(true);
        try {
            const addedProduct = await addProductToDb(productData);
            // Registrar actividad en Firestore
            if (user) {
                await logProductActivity(addedProduct || productData, user, "manual");
            }
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
        setIsSaving(true);
        try {
            await updateProductInDb(id, productData);
            await fetchProducts();
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
    const uploadProductsFromJson = async (loadedProducts, user) => {
        setIsUploadingJson(true);
        setJsonUploadFeedback({ message: '', type: '' });

        try {
            const { uploadedCount, failedCount, errors, results } = await addProductsFromJsonToDb(loadedProducts);
            // Filtrar solo los productos subidos con éxito
            const uploadedProducts = results
                .filter(r => r.status === 'success')
                .map(r => r.product);
            // Filtrar productos fallidos
            const failedProducts = results
                .filter(r => r.status === 'failed')
                .map(r => ({ productTitle: r.productTitle }));

            // Registrar actividad masiva en Firestore
            if (user && (uploadedProducts.length > 0 || failedProducts.length > 0)) {
                await logProductActivityMassive(uploadedProducts, user, failedProducts);
            }

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
            await fetchProducts();
            return { uploadedCount, failedCount, errors };
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
        products: productsData.paginatedProducts,
        allProducts,
        categories,
        isLoading,
        error,
        isSaving,
        isDeletingId,
        jsonUploadFeedback,
        isUploadingJson,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadProductsFromJson,
        setJsonUploadFeedback,
        totalPages: productsData.totalPages,
        totalProducts: productsData.totalProducts,
        filteredProducts: productsData.filteredAndSortedProducts // for infinite scroll
    };
};