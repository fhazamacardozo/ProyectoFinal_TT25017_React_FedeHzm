import { useEffect, useState } from "react";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ProductFormModal from "../Components/ProductFormModal"; 
import JsonUploadModal from "../Components/JsonUploadModal";
import { initialProductState } from "../Utils/InitialProductState"; 
import { 
        getProductsFromDb,
        addProductToDb,
        updateProductInDb,
        deleteProductFromDb,
        addProductsFromJsonToDb, 
    } 
    from "../Services/ProductService,jsx";

function ProductManager() {
    const [products, setProducts] = useState([]);

    const [newProduct, setNewProduct] = useState(initialProductState);
    const [editingProduct, setEditingProduct] = useState(null);

    // Estados para controlar la visibilidad de los modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showJsonUploadModal, setShowJsonUploadModal] = useState(false);

    const [isUploadingJson, setIsUploadingJson] = useState(false); 
    const [jsonUploadFeedback, setJsonUploadFeedback] = useState({ message: '', type: '' }); 

    const [isLoading, setIsLoading] = useState(false); // Para el spinner de guardado/actualización
    const [isDeletingId, setIsDeletingId] = useState(null); //para spinner de eliminación

    const MySwal = withReactContent(Swal); // Instancia de SweetAlert2

    // --- Funciones para abrir/cerrar modales ---
    const handleShowAddModal = () => {
        setNewProduct(initialProductState); // Asegura que el formulario de agregar esté limpio
        setShowAddModal(true);
    };
    const handleCloseAddModal = () => setShowAddModal(false);

    const handleShowEditModal = (product) => {
        // Asegurarse de que los valores numéricos sean cadenas para los inputs del formulario
        const productForEdit = {
        ...product,
        price: product.price !== undefined && product.price !== null ? String(product.price) : "",
        rating: {
            ...product.rating,
            count: product.rating?.count !== undefined && product.rating?.count !== null ? String(product.rating.count) : "",
            rate: product.rating?.rate !== undefined && product.rating?.rate !== null ? String(product.rating.rate) : ""
        }
        };
        setEditingProduct(productForEdit);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingProduct(null); // Limpiar el producto en edición
    };

    const handleShowJsonUploadModal = () => {
        setJsonUploadFeedback({ message: '', type: '' }); // Resetear feedback
        setShowJsonUploadModal(true);
    };
    const handleCloseJsonUploadModal = () => setShowJsonUploadModal(false);

    // --- Funciones CRUD (ahora llaman al servicio) ---

 // Obtener productos
    const fetchProducts = async () => {
        setIsLoading(true); // Podrías usar un estado de carga general para la tabla
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
        } finally {
            setIsLoading(false); // Finalizar carga general
        }
    };

  // Agregar un producto
  const handleAddProduct = async (productData) => { // Cambiado el nombre a 'handle'
    try {
        await addProductToDb(productData); // <--- Llamada al servicio
        await fetchProducts(); // Recargar la lista
        return true;
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        return false;
    }
};

  // Actualizar un producto
  const handleUpdateProduct = async (id, productData) => { // Cambiado el nombre a 'handle'
    try {
      await updateProductInDb(id, productData); // <--- Llamada al servicio
      await fetchProducts(); // Recargar la lista
        return true;
    } 
    catch (error) {
        console.error("Error al actualizar el producto:", error);
        return false;
    }
    };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => { // Cambiado el nombre a 'handle'
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

    // --- Manejador de Submit Unificado ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let success = false;
        if (showAddModal) {
            success = await handleAddProduct(newProduct);
        } else if (showEditModal && editingProduct) {
            success = await handleUpdateProduct(editingProduct.id, editingProduct);
        }

        setIsLoading(false);

        if (!success) {
        MySwal.fire({
            title: "Error",
            text: showAddModal
            ? "Error al agregar el producto"
            : "Error al actualizar el producto",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        } else {
        MySwal.fire({
            title: "Éxito",
            text: showAddModal
            ? "Producto agregado correctamente"
            : "Producto actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
        });
        // Cerrar el modal correspondiente
        showAddModal ? handleCloseAddModal() : handleCloseEditModal();
        }
    };

    // FUNCIÓN para manejar la carga de productos desde JSON
const handleProductsLoadedFromJson = async (loadedProducts) => {
        setIsUploadingJson(true); // Activa el spinner de carga para el modal JSON
        setJsonUploadFeedback({ message: '', type: '' }); // Limpia feedback previo

        try {
            const { uploadedCount, failedCount, errors } = await addProductsFromJsonToDb(loadedProducts); // Llama al servicio

            if (failedCount > 0) {
                setJsonUploadFeedback({
                    message: `Se subieron ${uploadedCount} producto(s) con éxito, pero ${failedCount} fallaron.`,
                    type: 'warning'
                });
                console.error("Detalles de errores en la subida JSON:", errors);
                // Si hubo fallos, podríamos no cerrar el modal para que el usuario vea el mensaje de advertencia.
                // O cerrarlo después de un breve retraso.
                // setTimeout(() => handleCloseJsonUploadModal(), 4000); // Ejemplo: cerrar después de 4 segundos
            } else {
                setJsonUploadFeedback({
                    message: `¡Éxito! Se subieron ${uploadedCount} producto(s) correctamente.`,
                    type: 'success'
                });
                // Si todo fue exitoso, cerramos el modal inmediatamente
                handleCloseJsonUploadModal(); // <--- DESCOMENTA O AÑADE ESTA LÍNEA
            }
            await fetchProducts(); // Recargar la lista de productos en la tabla
        } catch (error) {
            console.error("Error al cargar productos desde JSON:", error);
            setJsonUploadFeedback({
                message: `Error grave al procesar el archivo JSON: ${error.message}`,
                type: 'danger'
            });
            // Si hay un error grave, podríamos no cerrar el modal o cerrarlo después de un retraso.
            // setTimeout(() => handleCloseJsonUploadModal(), 5000);
        } finally {
            setIsUploadingJson(false); // Desactiva el spinner
        }
    };

    useEffect(() => {
        fetchProducts(); 
    }, []);

    return (
        <div className="container mt-5">
        <h2>Gestor de Productos</h2>

        {/* Botones para abrir modal de agreggar */}
        <Button variant="primary" onClick={handleShowAddModal} className="mb-3 me-2">
            Agregar Nuevo Producto
        </Button>
        {/*BOTÓN para abrir el modal de subida JSON */}
        <Button variant="success" onClick={handleShowJsonUploadModal} className="mb-3">
            Cargar Productos desde JSON
        </Button>

        {/* Mensajes de feedback para la subida JSON (se muestran debajo de los botones) */}
        {jsonUploadFeedback.message && (
            <Alert variant={jsonUploadFeedback.type} className="mt-3">
                {jsonUploadFeedback.message}
            </Alert>
        )}

        {/* Modal para Agregar Producto */}
            <ProductFormModal
                show={showAddModal}
                onHide={handleCloseAddModal}
                product={newProduct}
                setProduct={setNewProduct}
                onSubmit={handleSubmit}
                title="Agregar Nuevo Producto"
                isLoading={isLoading}
            />

        {/* Modal para Editar Producto */}
        {editingProduct && ( // Solo renderiza si hay un producto para editar
            <ProductFormModal
                show={showEditModal}
                onHide={handleCloseEditModal}
                product={editingProduct}
                setProduct={setEditingProduct}
                onSubmit={handleSubmit}
                title="Editar Producto"
                isLoading={isLoading}
            />
        )}
        {/* MODAL DE SUBIDA JSON */}
        <JsonUploadModal
            show={showJsonUploadModal}
            onHide={handleCloseJsonUploadModal}
            onProductsLoaded={handleProductsLoadedFromJson}
            isLoading={isUploadingJson} // Pasa el estado de carga al modal
        />

        {/* Tabla de productos */}
        <Table striped bordered hover responsive className="mt-3">
            <thead>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Imagen</th>
                <th>Rating (Votos/Tasa)</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {products.length === 0 ? (
                <tr>
                <td colSpan="7" className="text-center">
                    No hay productos disponibles.
                </td>
                </tr>
            ) : (
                products.map((product) => (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>${product.price !== undefined && product.price !== null ? product.price.toFixed(2) : "N/A"}</td>
                    <td>
                    {product.image && (
                        <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                    )}
                    </td>
                    <td>
                    {product.rating?.count || 0} / {product.rating?.rate || 0}
                    </td>
                    <td>
                    <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowEditModal(product)}
                        className="me-2"
                    >
                        Editar
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        // Deshabilita el botón si este producto se está eliminando
                        // y muestra el spinner.
                        disabled={isDeletingId === product.id}
                        onClick={() => handleDeleteProduct(product.id)}
                    >
                        {isDeletingId === product.id ? (
                            <>
                                <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-1" // Espacio entre spinner y texto
                                />
                                Eliminando...
                            </>
                        ) : (
                            "Eliminar"
                        )}
                    </Button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </Table>
        </div>
    );
}

export default ProductManager;