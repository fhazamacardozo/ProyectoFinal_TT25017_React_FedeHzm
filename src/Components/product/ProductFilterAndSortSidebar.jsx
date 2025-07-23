import { useState } from 'react';
import { Form, Button, Collapse } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; 

function ProductFilterAndSortSidebar({
    categories = [],
    selectedCategories = [],
    onCategoryChange,
    selectedRating,
    onRatingChange,
    sortOption,
    onSortChange,
    onClearFilters,
    pageSize,
    onPageSizeChange,
    isMobile = false
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

    const [showCategories, setShowCategories] = useState(false);

    return (
        <div className="sidebar p-3 border rounded shadow-sm">
            <h5 className="mb-3 text-primary">Filtros y Ordenamiento</h5>

            {/* Category Filter (Multi-select, Collapsible) */}
            <div className="mb-4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h6 className="mb-2" style={{ marginBottom: 0 }}>Categorías</h6>
                    <Button
                        variant="link"
                        size="sm"
                        aria-expanded={showCategories}
                        onClick={() => setShowCategories((prev) => !prev)}
                        style={{ textDecoration: 'none' }}
                    >
                        {showCategories ? 'Ocultar' : 'Mostrar'}
                    </Button>
                </div>
                <Collapse in={showCategories}>
                    <div>
                        <Form>
                            <Form.Check
                                type="checkbox"
                                id="category-all"
                                label="Todas"
                                checked={selectedCategories.length === 0}
                                onChange={() => onCategoryChange([])}
                                className="mb-2"
                            />
                            {categories.map((category) => (
                                <Form.Check
                                    key={category}
                                    type="checkbox"
                                    id={`category-${category}`}
                                    label={category}
                                    checked={selectedCategories.includes(category)}
                            onChange={() => {
                                let newCats;
                                if (selectedCategories.includes(category)) {
                                    newCats = selectedCategories.filter((c) => c !== category);
                                } else {
                                    newCats = [...selectedCategories, category];
                                }
                                onCategoryChange(newCats);
                                setShowCategories(false); // Oculta la lista tras seleccionar/deseleccionar
                            }}
                                    className="mb-1"
                                />
                            ))}
                        </Form>
                    </div>
                </Collapse>
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


            {/* Items per page selector (hide on mobile) */}
            {!isMobile && (
                <div className="mb-4">
                    <h6 className="mb-2">Items por página</h6>
                    <Form.Select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value={96}>96</option>
                    </Form.Select>
                </div>
            )}

            <Button variant="outline-danger" onClick={onClearFilters} className="w-100">
                Limpiar Filtros
            </Button>
        </div>
    );
}

export default ProductFilterAndSortSidebar;