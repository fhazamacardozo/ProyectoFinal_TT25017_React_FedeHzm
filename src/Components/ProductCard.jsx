import styles from './ProductCard.module.css';
import Button from "./Button";

function ProductCard({ item, buttonText, onClick_ }) {
    return (
        <div className={styles.card} key={item.id}>
            <div className={styles['image-container']}> {/* Notación de corchetes para nombres con guiones */}
                <img src={item.image} alt={item.title} />
            </div>
            <h6>{item.title}</h6>
            <p className={styles.price}>${item.price}</p>
            <p className={styles.category}>{item.category}</p>
            <p className={styles.rating} >Rating: {item.rating.rate} ({item.rating.count})</p>
            {buttonText && (
                <Button
                    text={buttonText}
                    onClick={onClick_}
                />
            )}
        </div>
    );
}

export default ProductCard;