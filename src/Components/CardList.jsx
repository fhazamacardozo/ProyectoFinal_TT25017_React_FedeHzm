import ProductCard from "./ProductCard";
function CardList({ items, buttonText, onClick_ = () => {} }) {

    return(
        <div style={{
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '20px',
                padding: '20px',
                justifyContent: 'center'                
            }}
        >
            {items.map((item) => 
                (
                    <ProductCard
                        key={item.id}
                        item={item}
                        buttonText={buttonText}
                        onClick_={() => onClick_(item)}
                    />
                )
            )
        }
        </div>
    )
}

export default CardList;