import { Row, Col } from 'react-bootstrap'; 
import ProductCard from "./ProductCard";

function CardList({ items, buttonText, onShowDetails = () => {}, onAddToCart }) {
    return(
        <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
            {items.map((item) =>
                (
                    <Col key={item.id}>
                        <ProductCard
                            item={item}
                            buttonText={buttonText}
                            onShowDetails={() => onShowDetails(item)}
                            onAddToCart={onAddToCart}
                        />
                    </Col>
                )
            )}
        </Row>
    )
}

export default CardList;