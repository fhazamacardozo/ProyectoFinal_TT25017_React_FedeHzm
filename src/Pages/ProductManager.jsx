import { useState } from "react";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import ProductFormModal from "../Components/ProductFormModal"; 
import JsonUploadModal from "../Components/JsonUploadModal";
import { initialProductState } from "../Utils/InitialProductState"; 
import { useProductManagement } from "../Hooks/useProductManagement";
import {Title, Meta} from 'react-head'; // Importar para manejar el título y metadatos de la página

function ProductManager() {
    const {
        products,
        isLoading,
        isSaving,
        isDeletingId,
        jsonUploadFeedback,
        isUploadingJson,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadProductsFromJson,
        setJsonUploadFeedback // Para permitir limpiar el feedback del JSON desde aquí
    } = useProductManagement();

    const [newProduct, setNewProduct] = useState(initialProductState);
    const [editingProduct, setEditingProduct] = useState(null);

    // Estados para controlar la visibilidad de los modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showJsonUploadModal, setShowJsonUploadModal] = useState(false);

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
    const handleAddSubmit = async (productData) => {
        const success = await addProduct(productData);
        if (success) {
            handleCloseAddModal();
        }
    };

    const handleEditSubmit = async (productData) => {
        const success = await updateProduct(editingProduct.id, productData);
        if (success) {
            handleCloseEditModal();
        }
    };

    const handleDeleteProduct = async (productId) => {
        await deleteProduct(productId);
    }

    const handleJsonUploadSubmit = async (loadedProducts) => {
        // No manejamos el feedback de SweetAlerts aquí, lo hace el hook
        const result = await uploadProductsFromJson(loadedProducts);
        // Si todo fue exitoso, cerramos el modal. Si no, el feedback queda visible.
        if (result.failedCount === 0) {
            handleCloseJsonUploadModal();
        }
    };



    return (
        <div className="container mt-5">
            {/* Título y descripción de la página */}
            <Title>Gestor de Productos - E-commerce Demo</Title>
            <Meta name="description" content="Administra los productos de tu tienda online. Agrega, edita y elimina productos fácilmente." />
            <Meta name="keywords" content="gestor de productos, administración, e-commerce, react, tienda online" />
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
                    onSubmit={handleAddSubmit}
                    title="Agregar Nuevo Producto"
                    isLoading={isSaving}
                />

            {/* Modal para Editar Producto */}
            {editingProduct && ( // Solo renderiza si hay un producto para editar
                <ProductFormModal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    product={editingProduct}
                    setProduct={setEditingProduct}
                    onSubmit={handleEditSubmit}
                    title="Editar Producto"
                    isLoading={isSaving}
                />
            )}
            {/* MODAL DE SUBIDA JSON */}
            <JsonUploadModal
                show={showJsonUploadModal}
                onHide={handleCloseJsonUploadModal}
                onProductsLoaded={handleJsonUploadSubmit}
                isLoading={isUploadingJson} // Pasa el estado de carga al modal
                setJsonUploadFeedback={setJsonUploadFeedback} // Permite limpiar el feedback desde el modal
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
                {isLoading ? ( // Use isLoading from the hook
                        <tr>
                            <td colSpan="7" className="text-center">
                                <Spinner animation="border" role="status" className="me-2" />
                                Cargando productos...
                            </td>
                        </tr>
                    ) :products.length === 0 ? (
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