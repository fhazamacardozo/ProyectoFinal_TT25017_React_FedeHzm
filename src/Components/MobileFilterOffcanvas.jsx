import { Offcanvas } from 'react-bootstrap';
import ProductFilterAndSortSidebar from './ProductFilterAndSortSidebar';

function MobileFilterOffcanvas({
    show,
    onHide,
    categories,
    selectedCategory,
    onCategoryChange,
    selectedRating,
    onRatingChange,
    sortOption,
    onSortChange,
    onClearFilters
}) {
    return (
        <Offcanvas show={show} onHide={onHide} placement="start" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filtros de Productos</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ProductFilterAndSortSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={(cat) => {
                        onCategoryChange(cat);
                        onHide(); // Close offcanvas after selection
                    }}
                    selectedRatingExclusive={selectedRating}
                    onRatingChangeExclusive={(rating) => {
                        onRatingChange(rating);
                        onHide(); // Close offcanvas after selection
                    }}
                    sortOption={sortOption}
                    onSortChange={(sort) => {
                        onSortChange(sort);
                        onHide(); // Close offcanvas after selection
                    }}
                    onClearFilters={() => {
                        onClearFilters();
                        onHide(); // Always close after clearing
                    }}
                />
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default MobileFilterOffcanvas;