import { useContext, useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CardList from "../Components/product/CardList";
import { CartContext } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext"; 
import { useProductManagement } from "../Hooks/useProductManagement";
import { useHandleAddToCart } from "../Hooks/useHandleAddToCart";
import { useIsMobile, useInfiniteScroll } from "../Hooks/useMobileAndInfiniteScroll";
import { useShowScrollToTopButton } from "../Hooks/useShowScrollToTopButton";
import ProductDetailModal from "../Components/product/ProductDetailModal";
import ProductFilterAndSortSidebar from "../Components/product/ProductFilterAndSortSidebar";
import SearchBar from "../Components/common/SearchBar";
import { FaFilter } from "react-icons/fa";
import MobileFilterOffcanvas from "../Components/product/MobileFilterOffcanvas";

import ScrollToTopButton from "../Components/common/ScrollToTopButton";
import { Title, Meta } from 'react-head';



function Catalogue() {

    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileLoadedCount, setMobileLoadedCount] = useState(12);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const pageSize = 12;

    // --- Hooks ---
    const isMobile = useIsMobile();
    const {
        products,
        categories,
        isLoading,
        error,
        totalPages,
        filteredProducts
    } = useProductManagement(
        appliedSearchTerm,
        selectedCategory,
        selectedRating,
        sortOption,
        currentPage,
        pageSize
    );
    useInfiniteScroll({ isMobile, mobileLoadedCount, setMobileLoadedCount, filteredProducts, pageSize });
    const { isAuthenticated } = useAuth();
    const { addToCart } = useContext(CartContext);
    const handleAddToCart = useHandleAddToCart(addToCart, isAuthenticated);

    // --- Effects ---
    // Show scroll to top button based on mobile state
    const showScrollToTopButton = useShowScrollToTopButton(isMobile);

    // Scroll to top on page change for desktop
    useEffect(() => {
        if (!isMobile) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage, isMobile]);

    // --- Handlers ---
    const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const handleOpenModal = (item) => { setSelectedItem(item); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedItem(null); };
    const handleSearchSubmit = () => { setAppliedSearchTerm(searchTerm); setCurrentPage(1); };
    const handleCategoryChange = (cat) => { setSelectedCategory(cat); setCurrentPage(1); };
    const handleRatingChange = (rating) => { setSelectedRating(rating); setCurrentPage(1); };
    const handleSortChange = (sort) => { setSortOption(sort); setCurrentPage(1); };
    const handleClearFilters = () => {
        setSearchTerm('');
        setAppliedSearchTerm('');
        setSelectedCategory('');
        setSelectedRating(0);
        setSortOption('');
        setCurrentPage(1);
        setShowOffcanvas(false);
    };
    const handleOffcanvasClose = () => setShowOffcanvas(false);
    const handleOffcanvasShow = () => setShowOffcanvas(true);

    // Products to show: paginated for desktop, infinite for mobile (memoized)
    const productsToShow = useMemo(() => (
        isMobile
            ? filteredProducts.slice(0, mobileLoadedCount)
            : products
    ), [isMobile, filteredProducts, mobileLoadedCount, products]);

    if (isLoading) {
        return (
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#fff',
                width: '100%'
            }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 fs-5 text-secondary">Cargando productos...</p>
            </div>
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
            <Title>Catálogo de Productos - E-commerce Demo</Title>
            <Meta name="description" content="Explora todos los productos de nuestro catálogo. Filtra por categoría, precio y rating." />
            <Meta name="keywords" content="productos, catálogo, comprar, online, electrónica, ropa, joyería" />
            <Row>
                <Col md={3} className="d-none d-md-block">
                    {/* Sidebar for Filters and Sort */}
                    <ProductFilterAndSortSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        selectedRating={selectedRating}
                        onRatingChange={handleRatingChange}
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                    />
                </Col>

                <Col xs={12} md={9}> {/* xs=12 ensures it takes full width on small screens */}
                    {/* Sticky Filter Button and Search Bar for Mobile */}
                    <div
                        className="d-md-none"
                        style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 1020,
                            background: '#f8f9fa',
                            padding: '12px 0 8px 0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                    >
                        <div className="mb-2 text-center">
                            <Button variant="outline-primary" onClick={handleOffcanvasShow}>
                                <FaFilter className="me-2" />
                                Mostrar Filtros
                            </Button>
                        </div>
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onSearchSubmit={handleSearchSubmit}
                        />
                    </div>

                    {/* Desktop Search Bar (not sticky) */}
                    <div className="d-none d-md-block mb-3">
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onSearchSubmit={handleSearchSubmit}
                        />
                    </div>

                    <section className="mb-5">
                        <h2 className="text-primary mb-4 text-center">Productos</h2>
                        {filteredProducts.length === 0 && (
                            <p className="text-center text-muted">No se encontraron productos con los filtros aplicados.</p>
                        )}
                        <CardList
                            items={productsToShow}
                            buttonText="Ver Detalles"
                            onShowDetails={handleOpenModal}
                            onAddToCart={handleAddToCart}
                        />
                        {/* Desktop Pagination Controls */}
                        {!isMobile && filteredProducts.length > 0 && totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </section>
                </Col>
            </Row>
            

            {/* Mobile Filter Offcanvas Component */}
            <MobileFilterOffcanvas
                show={showOffcanvas}
                onHide={handleOffcanvasClose}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                selectedRatingExclusive={selectedRating}
                onRatingChangeExclusive={handleRatingChange}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
            />

            {/* Botón flotante para volver arriba en mobile */}
            <ScrollToTopButton show={isMobile && showScrollToTopButton} onClick={handleScrollToTop} />


           {/* Product Detail Modal */}
            <ProductDetailModal
                show={isModalOpen}
                onHide={handleCloseModal}
                selectedItem={selectedItem}
                addToCart={addToCart}
                isAuthenticated={isAuthenticated}
            />
        </Container>
    );
}

export default Catalogue;