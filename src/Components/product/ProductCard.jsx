import { Card, Button, Spinner } from 'react-bootstrap'; 
import styles from './ProductCard.module.css';

/**
 * ProductCard: fully generic, renders product info and a list of action buttons.
 * Props:
 * - item: product object
 * - actions: array of { label, onClick, isLoading, variant, icon, disabled, ... }
 */
function ProductCard({ item, actions }) {
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

                {/* Generic actions array (only) */}
                {Array.isArray(actions) && actions.length > 0 && (
                    <div className="d-flex flex-column gap-2 mt-2">
                        {actions.map((action, idx) => (
                            <Button
                                key={idx}
                                variant={action.variant || 'primary'}
                                className={action.className || 'w-100'}
                                onClick={() => action.onClick && action.onClick(item)}
                                disabled={action.disabled || action.isLoading}
                            >
                                {action.isLoading && (
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                )}
                                {action.icon && <span className="me-2">{action.icon}</span>}
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProductCard;