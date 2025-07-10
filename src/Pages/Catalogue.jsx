import { useState, useContext, } from "react";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
import CardList from "../Components/CardList";
import { CartContext } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext"; 
import { useProductManagement } from "../Hooks/useProductManagement";
import ProductDetailModal from "../Components/ProductDetailModal";
import ProductFilterAndSortSidebar from "../Components/ProductFilterAndSortSidebar";
import SearchBar from "../Components/SearchBar";
import { FaFilter } from "react-icons/fa";

function Catalogue() {
   // States for search, filter, and sort
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRating, setSelectedRating] = useState(0); // 0 means no minimum rating
    const [sortOption, setSortOption] = useState(''); // e.g., 'name_asc', 'price_desc'

    // State for Offcanvas visibility
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    // Destructure properties from your custom hook, passing in filter/sort parameters
    const { products, categories, isLoading, error } = useProductManagement(
        appliedSearchTerm,
        selectedCategory,
        selectedRating,
        sortOption
    );

    const { isAuthenticated } = useAuth();
    const { addToCart } = useContext(CartContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);


    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleSearchSubmit = () => {
        setAppliedSearchTerm(searchTerm); // Apply search only when button is clicked or Enter is pressed
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setAppliedSearchTerm('');
        setSelectedCategory('');
        setSelectedRating(0);
        setSortOption('');
        setShowOffcanvas(false);
    };

    // Handlers for Offcanvas
    const handleOffcanvasClose = () => setShowOffcanvas(false);
    const handleOffcanvasShow = () => setShowOffcanvas(true);

    if (isLoading) {
        return (
            <Container fluid className="py-4 bg-light text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando productos...</p>
            </Container>
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

            <Row>
                <Col md={3} className="d-none d-md-block">
                    {/* Sidebar for Filters and Sort */}
                    <ProductFilterAndSortSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        selectedRating={selectedRating}
                        onRatingChange={setSelectedRating}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                        onClearFilters={handleClearFilters}
                    />
                </Col>

                <Col xs={12} md={9}> {/* xs=12 ensures it takes full width on small screens */}
                    {/* Filter Button for Mobile - Visible on small screens (md-down) */}
                    <div className="d-md-none mb-3 text-center">
                        <Button variant="outline-primary" onClick={handleOffcanvasShow}>
                            <FaFilter className="me-2" />
                            Mostrar Filtros
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onSearchSubmit={handleSearchSubmit}
                    />

                    <section className="mb-5">
                        <h2 className="text-primary mb-4 text-center">Productos</h2>
                        {products.length === 0 && (
                            <p className="text-center text-muted">No se encontraron productos con los filtros aplicados.</p>
                        )}
                        <CardList
                            items={products}
                            buttonText="Ver Detalles"
                            onClick_={handleOpenModal}
                        />
                    </section>
                </Col>
            </Row>
            {/* Offcanvas for Filters - Visible on small screens (md-down) */}{/* Offcanvas for Mobile Filters */}
            <Offcanvas show={showOffcanvas} onHide={handleOffcanvasClose} placement="start" responsive="md">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filtros de Productos</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ProductFilterAndSortSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={(cat) => {
                            setSelectedCategory(cat);
                            handleOffcanvasClose(); // Optionally close offcanvas after selection
                        }}
                        selectedRatingExclusive={selectedRating}
                        onRatingChangeExclusive={(rating) => {
                            setSelectedRating(rating);
                            handleOffcanvasClose(); // Optionally close offcanvas after selection
                        }}
                        sortOption={sortOption}
                        onSortChange={(sort) => {
                            setSortOption(sort);
                            handleOffcanvasClose(); // Optionally close offcanvas after selection
                        }}
                        onClearFilters={() => {
                            handleClearFilters();
                            handleOffcanvasClose(); // Always close after clearing
                        }}
                    />
                </Offcanvas.Body>
            </Offcanvas>           
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