import { Card,Button } from 'react-bootstrap'; 
import styles from './ProductCard.module.css';



function ProductCard({ item, buttonText, onShowDetails, onAddToCart }) {
    return (
        <Card className={`h-100 ${styles.customCard}`}>
            <Card.Img
                variant="top"
                src={item.image}
                alt={item.title}
                className={styles.cardImage}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title as="h6" className={styles.cardTitle}>
                    {item.title}
                </Card.Title>
                <Card.Text className={styles.price}>${item.price}</Card.Text>
                <Card.Text className={styles.category}>{item.category}</Card.Text>
                <Card.Text className={styles.rating}>Rating: {item.rating.rate} ({item.rating.count})</Card.Text>

                {buttonText && (
                    <Button variant="primary" className="mb-2 w-100" onClick={onShowDetails}>
                        {buttonText}
                    </Button>
                )}
                {onAddToCart && (
                    <Button variant="success" className="w-100" onClick={() => onAddToCart(item)}>
                        Añadir al carrito
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProductCard;