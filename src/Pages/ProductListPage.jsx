import { Button, Row, Col, Alert } from "react-bootstrap";
import ProductFilterAndSortSidebar from "../Components/product/ProductFilterAndSortSidebar";
import SearchBar from "../Components/common/SearchBar";
import CardList from "../Components/product/CardList";
import MobileFilterOffcanvas from "../Components/product/MobileFilterOffcanvas";
import ScrollToTopButton from "../Components/common/ScrollToTopButton";
import { useShowScrollToTopButton } from "../Hooks/useShowScrollToTopButton";
import { useIsMobile, useInfiniteScroll } from "../Hooks/useMobileAndInfiniteScroll";
import { useState, useMemo } from "react";
import { FaFilter } from "react-icons/fa";

/**
 * Componente reutilizable para páginas de listado de productos con filtros, ordenamiento y acciones customizables.
 * Props:
 * - title: string
 * - description: string
 * - products: array (raw, unfiltered)
 * - categories: array
 * - isLoading: bool
 * - error: string
 * - getActions: function(product) => array of action objects (for CardList/ProductCard) (optional, overrides default)
 * - extraHeader: JSX (opcional)
 * - extraFooter: JSX (opcional)
 * - showMobileOffcanvas: bool (default true)
 * - renderMobileOffcanvas: function (optional, overrides default)
 * - showScrollToTop: bool (default true)
 * - renderScrollToTopButton: function (optional, overrides default)
 */

function ProductListPage({
    title,
    description,
    products,
    categories = [],
    isLoading,
    error,
    getActions,
    extraHeader,
    extraFooter,
    showMobileOffcanvas = true,
    renderMobileOffcanvas,
    showScrollToTop = true,
    renderScrollToTopButton
}) {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortOption, setSortOption] = useState('name_asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileLoadedCount, setMobileLoadedCount] = useState(12);
    const [pageSize, setPageSize] = useState(12);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const isMobile = useIsMobile();
    const showScrollBtn = useShowScrollToTopButton(isMobile);


    // Filtering, then sorting
    const filteredProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesSearch = !appliedSearchTerm || p.title.toLowerCase().includes(appliedSearchTerm.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
            const matchesRating = !selectedRating || (p.rating && p.rating.rate >= selectedRating);
            return matchesSearch && matchesCategory && matchesRating;
        });
        // Ordenamiento
        if (sortOption) {
            result = [...result];
            switch (sortOption) {
                case 'name_asc':
                    result.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'name_desc':
                    result.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case 'price_asc':
                    result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
                    break;
                case 'price_desc':
                    result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
                    break;
                case 'rating_desc':
                    result.sort((a, b) => ((b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)));
                    break;
                case 'rating_asc':
                    result.sort((a, b) => ((a.rating?.rate ?? 0) - (b.rating?.rate ?? 0)));
                    break;
                default:
                    break;
            }
        }
        return result;
    }, [products, appliedSearchTerm, selectedCategories, selectedRating, sortOption]);

    // Infinite scroll en mobile
    useInfiniteScroll({
        isMobile,
        mobileLoadedCount,
        setMobileLoadedCount,
        filteredProducts,
        pageSize
    });

    // Products to show: paginated for desktop, infinite for mobile
    const productsToShow = isMobile
        ? filteredProducts.slice(0, mobileLoadedCount)
        : filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    // Handlers
    const resetMobileLoadedCount = () => setMobileLoadedCount(pageSize);
    const handleSearchSubmit = () => { setAppliedSearchTerm(searchTerm); setCurrentPage(1); resetMobileLoadedCount(); };
    const handleCategoryChange = (cats) => { setSelectedCategories(cats); setCurrentPage(1); resetMobileLoadedCount(); };
    const handleRatingChange = (rating) => { setSelectedRating(rating); setCurrentPage(1); resetMobileLoadedCount(); };
    const handleSortChange = (sort) => { setSortOption(sort); setCurrentPage(1); resetMobileLoadedCount(); };
    const handleClearFilters = () => {
        setSearchTerm('');
        setAppliedSearchTerm('');
        setSelectedCategories([]);
        setSelectedRating(0);
        setSortOption('');
        setCurrentPage(1);
        setPageSize(12);
        resetMobileLoadedCount();
    };

    // Items per page selector handler
    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
        resetMobileLoadedCount();
    };
    const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // Scroll to top when changing page (desktop)
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Default mobile offcanvas
    const defaultMobileOffcanvas = (
        <MobileFilterOffcanvas
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            selectedRating={selectedRating}
            onRatingChange={handleRatingChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
        />
    );

    // Default scroll-to-top button
    const defaultScrollToTopButton = (
        <ScrollToTopButton show={showScrollBtn} onClick={handleScrollToTop} />
    );

    // Default getActions if not provided
    const defaultGetActions = () => [];

    return (
        <div className="container mt-5">
            {/* Mobile offcanvas (default or custom) */}
            {showMobileOffcanvas && (
                renderMobileOffcanvas ? 
                renderMobileOffcanvas({showOffcanvas, setShowOffcanvas, categories}) : defaultMobileOffcanvas)}
            {/* Scroll-to-top button (default or custom) */}
            {showScrollToTop && (
                renderScrollToTopButton ? 
                renderScrollToTopButton({show: showScrollBtn}) : defaultScrollToTopButton)}
            <h2>{title}</h2>
            <p className="text-muted mb-4">{description}</p>
            {extraHeader}
            <Row>
                <Col md={3} className="d-none d-md-block">
                    <ProductFilterAndSortSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        selectedRating={selectedRating}
                        onRatingChange={handleRatingChange}
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </Col>
                <Col xs={12} md={9}>
                    {/* Mobile filter button (visible only on mobile) */}
                    {showMobileOffcanvas && (
                        <Button variant="outline-primary d-md-none mb-3" onClick={() => setShowOffcanvas(true)}>
                            <FaFilter className="me-2" />
                            Mostrar Filtros
                        </Button>
                    )}
                    {/* Search bar */}
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onSearchSubmit={handleSearchSubmit}
                    />
                    {/* Mensaje de error */}
                    {error && (
                        <Alert variant="danger" className="mt-3">{error}</Alert>
                    )}
                    {/* Listado de productos */}
                    {isLoading ? (
                        <div className="text-center mt-5">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="mt-3">Cargando productos...</p>
                        </div>
                    ) : productsToShow.length === 0 ? (
                        <p className="text-center text-muted mt-4">No hay productos disponibles.</p>
                    ) : (
                        <>
                            <CardList
                                items={productsToShow}
                                getActions={getActions || defaultGetActions}
                            />
                            {/* Desktop Pagination Controls (optional) */}
                            {!isMobile && totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <nav>
                                        <ul className="pagination">
                                            <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                                            </li>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                    {extraFooter}
                </Col>
            </Row>
        </div>
    );
}

export default ProductListPage;
