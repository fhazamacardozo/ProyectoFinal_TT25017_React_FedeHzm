import './Card.css';
import Button from "./Button";

function Card({ item, buttonText, onClick_ }) {
    return (
        <div className="card" key={item.id}>
            <img src={item.image} alt={item.title} />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p className="price">${item.price}</p>
            <p className="category">{item.category}</p>
            <p className="rating" >Rating: {item.rating.rate} ({item.rating.count})</p>
            {buttonText && (
                <Button
                    text={buttonText}
                    onClick={onClick_}
                />
            )}
        </div>
    );
}

export default Card;
