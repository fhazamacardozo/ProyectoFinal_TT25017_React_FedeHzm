import { Offcanvas } from 'react-bootstrap';
import ProductFilterAndSortSidebar from './ProductFilterAndSortSidebar';

function MobileFilterOffcanvas({
    show,
    onHide,
    categories,
    selectedCategories,
    onCategoryChange,
    selectedRating,
    onRatingChange,
    sortOption,
    onSortChange,
    onClearFilters,
    pageSize,
    onPageSizeChange
}) {
    // Handlers para cerrar el offcanvas al cambiar cualquier filtro
    const handleCategoryChange = (cats) => {
        onCategoryChange(cats);
        onHide();
    };
    const handleRatingChange = (rating) => {
        onRatingChange(rating);
        onHide();
    };
    const handleSortChange = (sort) => {
        onSortChange(sort);
        onHide();
    };
    const handleClearFilters = () => {
        onClearFilters();
        onHide();
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="start" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filtros de Productos</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
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
                    onPageSizeChange={onPageSizeChange}
                    isMobile={true}
                />
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default MobileFilterOffcanvas;