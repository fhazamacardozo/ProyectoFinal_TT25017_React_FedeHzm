export default function ScrollToTopButton({ show, onClick }) {
    if (!show) return null;
    return (
        <button
        onClick={onClick}
        style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 48,
            height: 48,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
        }}
        aria-label="Volver arriba"
        >
        ↑
        </button>
    );
}
