function Button({ text, onClick }) {
    return (
        <button onClick={onClick} className="btn btn-primary">
            {text}
        </button>
    );
}

export default Button;