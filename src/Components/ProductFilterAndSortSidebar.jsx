import { Form, Button, ListGroup } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // For rating stars

function ProductFilterAndSortSidebar({
    categories = [], // Ensure it has a default empty array
    selectedCategory,
    onCategoryChange,
    selectedRating,
    onRatingChange,
    sortOption,
    onSortChange,
    onClearFilters
}) {
    const renderRatingOptions = () => {
        return [5, 4, 3, 2, 1].map((rating) => (
            <Form.Check
                key={rating}
                type="radio"
                id={`rating-${rating}`}
                label={
                    <>
                        {Array.from({ length: rating }, (_, i) => (
                            <FaStar key={i} style={{ color: '#FFD700', marginRight: '2px' }} />
                        ))}
                        {rating < 5 }
                    </>
                }
                name="ratingFilter"
                value={rating}
                checked={selectedRating === rating}
                onChange={() => onRatingChange(rating)}
            />
        ));
    };

    return (
        <div className="sidebar p-3 border rounded shadow-sm">
            <h5 className="mb-3 text-primary">Filtros y Ordenamiento</h5>

            {/* Category Filter */}
            <div className="mb-4">
                <h6 className="mb-2">Categoría</h6>
                <ListGroup>
                    <ListGroup.Item
                        action
                        onClick={() => onCategoryChange('')}
                        active={selectedCategory === ''}
                    >
                        Todas
                    </ListGroup.Item>
                    {categories.map((category) => (
                        <ListGroup.Item
                            key={category}
                            action
                            onClick={() => onCategoryChange(category)}
                            active={selectedCategory === category}
                        >
                            {category}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
                <h6 className="mb-2">Valoración Mínima</h6>
                <Form>
                    <Form.Check
                        type="radio"
                        id="rating-any"
                        label="Cualquiera"
                        name="ratingFilter"
                        value={0}
                        checked={selectedRating === 0}
                        onChange={() => onRatingChange(0)}
                        className="mb-2"
                    />
                    {renderRatingOptions()}
                </Form>
            </div>

            {/* Sort Options */}
            <div className="mb-4">
                <h6 className="mb-2">Ordenar por</h6>
                <Form.Select value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
                    <option value="">Defecto</option>
                    <option value="name_asc">Nombre (A-Z)</option>
                    <option value="name_desc">Nombre (Z-A)</option>
                    <option value="price_asc">Precio (Menor a Mayor)</option>
                    <option value="price_desc">Precio (Mayor a Menor)</option>
                    <option value="rating_desc">Valoración (Mayor a Menor)</option>
                    <option value="rating_asc">Valoración (Menor a Mayor)</option>
                </Form.Select>
            </div>

            <Button variant="outline-danger" onClick={onClearFilters} className="w-100">
                Limpiar Filtros
            </Button>
        </div>
    );
}

export default ProductFilterAndSortSidebar;