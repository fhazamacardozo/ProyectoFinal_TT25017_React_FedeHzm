import { useContext, useState } from "react";
import ProductListPage from "./ProductListPage";
import { CartContext } from "../Context/CartContextDef";
import { useAuth } from "../Context/AuthContext"; 
import { useProductManagement } from "../Hooks/useProductManagement";
import { useHandleAddToCart } from "../Hooks/useHandleAddToCart";
import ProductDetailModal from "../Components/product/ProductDetailModal";
import { Title, Meta } from 'react-head';



function Catalogue() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const { isAuthenticated } = useAuth();
    const { addToCart, cartLoading, addingToCartId } = useContext(CartContext);
    const handleAddToCart = useHandleAddToCart(addToCart, isAuthenticated);
    const { allProducts, categories, isLoading, error } = useProductManagement();

    // Modal handlers
    const handleOpenModal = (item) => { setSelectedItem(item); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedItem(null); };

    return (
        <>
            <Title>Catálogo de Productos - E-commerce Demo</Title>
            <Meta name="description" content="Explora todos los productos de nuestro catálogo. Filtra por categoría, precio y rating." />
            <Meta name="keywords" content="productos, catálogo, comprar, online, electrónica, ropa, joyería" />

            {/* Product Detail Modal */}
            <ProductDetailModal
                show={isModalOpen}
                onHide={handleCloseModal}
                selectedItem={selectedItem}
                addToCart={addToCart}
                isAuthenticated={isAuthenticated}
            />

            <ProductListPage
                description=""
                products={allProducts}
                categories={categories}
                isLoading={isLoading}
                error={error}
                getActions={(item) => [
                    {
                        label: "Ver Detalles",
                        variant: "primary",
                        onClick: () => handleOpenModal(item)
                    },
                    {
                        label: cartLoading && addingToCartId === item.id ? "" : "Añadir al carrito",
                        variant: "success",
                        onClick: () => handleAddToCart(item),
                        isLoading: cartLoading && addingToCartId === item.id,
                        disabled: cartLoading && addingToCartId === item.id
                    }
                ]}
                extraHeader={
                    <div className="text-center mb-4">
                        <h1 className="display-5 fw-bold">Catálogo de Productos</h1>
                        <p className="lead text-muted">Explora nuestros productos destacados.</p>
                    </div>
                }
                showMobileOffcanvas={true}
                showScrollToTop={true}
            />
        </>
    );
}

export default Catalogue;