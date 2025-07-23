import { Row, Col } from 'react-bootstrap'; 
import ProductCard from "./ProductCard";

/**
 * CardList: renders a grid of ProductCards.
 * Props:
 * - items: array of products
 * - getActions: function(product) => array of action objects (see ProductCard)
 */
function CardList({ items, getActions }) {
    return(
        <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
            {items.map((item) => (
                <Col key={item.id}>
                    <ProductCard
                        item={item}
                        actions={getActions ? getActions(item) : []}
                    />
                </Col>
            ))}
        </Row>
    )
}

export default CardList;