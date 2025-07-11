import { Card,Button } from 'react-bootstrap'; 
import styles from './ProductCard.module.css';


function ProductCard({ item, buttonText, onClick_ }) {
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
                    <Button variant="primary" className="mt-auto w-100" onClick={onClick_}>
                        {buttonText}
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProductCard;