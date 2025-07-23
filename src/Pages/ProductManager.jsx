import { useState, useContext } from "react";
import { Button, Alert } from "react-bootstrap";
import ProductFormModal from "../Components/product/ProductFormModal"; 
import JsonUploadModal from "../Components/modals/JsonUploadModal";
import { initialProductState } from "../Utils/InitialProductState"; 
import { useProductManagement } from "../Hooks/useProductManagement";
import { AuthContext } from "../Context/AuthContextDef";
import { Title, Meta } from 'react-head';
import ProductListPage from "./ProductListPage";

function ProductManager() {
    const { user } = useContext(AuthContext);
    const {
        allProducts,
        categories,
        isLoading,
        isSaving,
        isDeletingId,
        jsonUploadFeedback,
        isUploadingJson,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadProductsFromJson,
        setJsonUploadFeedback,
        error
    } = useProductManagement();

    const [newProduct, setNewProduct] = useState(initialProductState);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showJsonUploadModal, setShowJsonUploadModal] = useState(false);

    const handleShowAddModal = () => {
        setNewProduct(initialProductState);
        setShowAddModal(true);
    };
    const handleCloseAddModal = () => setShowAddModal(false);
    const handleShowEditModal = (product) => {
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
        setEditingProduct(null);
    };
    const handleShowJsonUploadModal = () => {
        setJsonUploadFeedback({ message: '', type: '' });
        setShowJsonUploadModal(true);
    };
    const handleCloseJsonUploadModal = () => setShowJsonUploadModal(false);
    const handleAddSubmit = async (productData) => {
        const success = await addProduct(productData, user);
        if (success) handleCloseAddModal();
    };
    const handleEditSubmit = async (productData) => {
        const success = await updateProduct(editingProduct.id, productData);
        if (success) handleCloseEditModal();
    };
    const handleDeleteProduct = async (productId) => {
        await deleteProduct(productId);
    };
    const handleJsonUploadSubmit = async (loadedProducts) => {
        const result = await uploadProductsFromJson(loadedProducts, user);
        if (result.failedCount === 0) handleCloseJsonUploadModal();
    };

    return (
        <>
            <Title>Gestor de Productos - E-commerce Demo</Title>
            <Meta name="description" content="Administra los productos de tu tienda online. Agrega, edita y elimina productos fácilmente." />
            <Meta name="keywords" content="gestor de productos, administración, e-commerce, react, tienda online" />
            <ProductFormModal
                show={showAddModal}
                onHide={handleCloseAddModal}
                product={newProduct}
                setProduct={setNewProduct}
                onSubmit={handleAddSubmit}
                title="Agregar Nuevo Producto"
                isLoading={isSaving}
            />
            {editingProduct && (
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
            <JsonUploadModal
                show={showJsonUploadModal}
                onHide={handleCloseJsonUploadModal}
                onProductsLoaded={handleJsonUploadSubmit}
                isLoading={isUploadingJson}
                setJsonUploadFeedback={setJsonUploadFeedback}
            />
            <ProductListPage
                title="Gestor de Productos"
                description="Administra los productos de tu tienda online. Agrega, edita y elimina productos fácilmente."
                products={allProducts}
                categories={categories}
                isLoading={isLoading}
                error={error}
                getActions={(item) => [
                    {
                        label: "Editar",
                        variant: "info",
                        onClick: () => handleShowEditModal(item)
                    },
                    {
                        label: isDeletingId === item.id ? "Eliminando..." : "Eliminar",
                        variant: "danger",
                        onClick: () => handleDeleteProduct(item.id),
                        isLoading: isDeletingId === item.id,
                        disabled: isDeletingId === item.id
                    }
                ]}
                extraHeader={
                    <>
                        <Button variant="primary" onClick={handleShowAddModal} className="mb-3 me-2">
                            Agregar Nuevo Producto
                        </Button>
                        <Button variant="success" onClick={handleShowJsonUploadModal} className="mb-3">
                            Cargar Productos desde JSON
                        </Button>
                        {jsonUploadFeedback.message && (
                            <Alert variant={jsonUploadFeedback.type} className="mt-3">
                                {jsonUploadFeedback.message}
                            </Alert>
                        )}
                    </>
                }
                showMobileOffcanvas={true}
                showScrollToTop={true}
            />
        </>
    );
}

export default ProductManager;