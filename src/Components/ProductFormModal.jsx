// src/components/ProductFormModal.jsx
import { useState, useEffect } from "react";
import { Form, Button, Modal, Spinner } from "react-bootstrap";

function ProductFormModal({
    show,
    onHide,
    product, // el estado del producto (newProduct o editingProduct)
    setProduct, // el setter de ese estado (setNewProduct o setEditingProduct)
    onSubmit,
    title, // Título del modal (e.g., "Agregar Producto", "Editar Producto")
    isLoading,
}) {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({}); // New state to track if a field has been touched

    // Reset errors and touched state when the modal is shown or product changes
    useEffect(() => {
        if (show) {
            setErrors({});
            setTouched({});
        }
    }, [show, product]);

    // Protección adicional para 'product' en caso de que sea null inicialmente
    if (!product) {
        return null; // O un spinner si prefieres mostrar algo mientras se carga
    }

    // --- Validation Logic ---
    const validateField = (name, value, currentProduct) => {
        let error = "";
        let isValid = false;

        switch (name) {
            case "title":
                if (!value.trim()) {
                    error = "El título es obligatorio.";
                } else {
                    isValid = true;
                }
                break;
            case "category":
                if (!value.trim()) {
                    error = "La categoría es obligatoria.";
                } else {
                    isValid = true;
                }
                break;
            case "description":
                if (!value.trim()) {
                    error = "La descripción es obligatoria.";
                } else if (value.trim().length < 10) {
                    error = `La descripción debe tener al menos 10 caracteres. Faltan ${10 - value.trim().length}.`;
                } else {
                    isValid = true;
                }
                break;
            case "price":
                const priceValue = parseFloat(value);
                if (value === "" || isNaN(priceValue)) {
                    error = "El precio es obligatorio.";
                } else if (priceValue <= 0) {
                    error = "El precio debe ser mayor a 0.";
                } else {
                    isValid = true;
                }
                break;
            case "image":
                if (!value.trim()) {
                    error = "La URL de la imagen es obligatoria.";
                } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
                    error = "Introduce una URL de imagen válida (ej. .jpg, .png).";
                } else {
                    isValid = true;
                }
                break;
            case "ratingCount":
                const countValue = parseInt(value);
                if (value === "" || isNaN(countValue)) {
                    error = "El conteo de votos es obligatorio.";
                } else if (countValue < 0) {
                    error = "El conteo de votos no puede ser negativo.";
                } else {
                    isValid = true;
                }
                break;
            case "ratingRate":
                const rateValue = parseFloat(value);
                if (value === "" || isNaN(rateValue)) {
                    error = "La tasa de votos es obligatoria.";
                } else if (rateValue < 1 || rateValue > 5) {
                    error = "La tasa de votos debe estar entre 1 y 5.";
                } else {
                    isValid = true;
                }
                break;
            default:
                break;
        }
        return { error, isValid };
    };

    const validateForm = () => {
        const newErrors = {};
        const tempTouched = {}; // To mark all fields as touched on form submission

        // Re-validate all fields on submission to show all errors
        const fieldsToValidate = [
            { name: "title", value: product.title },
            { name: "category", value: product.category },
            { name: "description", value: product.description },
            { name: "price", value: product.price },
            { name: "image", value: product.image },
            { name: "ratingCount", value: product.rating?.count },
            { name: "ratingRate", value: product.rating?.rate },
        ];

        fieldsToValidate.forEach(({ name, value }) => {
            const { error } = validateField(name, value, product);
            if (error) {
                newErrors[name] = error;
            }
            tempTouched[name] = true; // Mark all fields as touched when submitting
        });

        setErrors(newErrors);
        setTouched(tempTouched); // Update touched state
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedProduct = { ...product };

        // Handle nested rating object
        if (name === "ratingCount" || name === "ratingRate") {
            updatedProduct = {
                ...product,
                rating: {
                    ...product.rating,
                    [name === "ratingCount" ? "count" : "rate"]:
                        value === "" ? "" : (name === "ratingCount" ? parseInt(value) : parseFloat(value)),
                },
            };
        } else if (name === "price") {
            updatedProduct = {
                ...product,
                price: value === "" ? "" : parseFloat(value),
            };
        } else {
            updatedProduct = {
                ...product,
                [name]: value,
            };
        }

        setProduct(updatedProduct);

        // Live validation for the current field
        const { error } = validateField(name, value, updatedProduct);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(e);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} noValidate> {/* Add noValidate to prevent browser's default validation */}
                    {/* Título */}
                    <Form.Group controlId="formTitle" className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce el título del producto"
                            name="title"
                            value={product.title}
                            onChange={handleChange}
                            isInvalid={!!errors.title && touched.title} // Show invalid only if touched AND has error
                            isValid={!errors.title && touched.title && product.title.trim() !== ""} // Show valid only if touched AND no error AND not empty
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            ¡Se ve bien!
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Categoría */}
                    <Form.Group controlId="formCategory" className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce la categoría del producto"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            isInvalid={!!errors.category && touched.category}
                            isValid={!errors.category && touched.category && product.category.trim() !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.category}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            ¡Se ve bien!
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Descripción */}
                    <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Introduce la descripción del producto"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            isInvalid={!!errors.description && touched.description}
                            isValid={!errors.description && touched.description && product.description.trim().length >= 10}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            ¡Descripción válida!
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Precio */}
                    <Form.Group controlId="formPrice" className="mb-3">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Introduce el precio del producto"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            isInvalid={!!errors.price && touched.price}
                            isValid={!errors.price && touched.price && parseFloat(product.price) > 0}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.price}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            ¡Precio válido!
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* URL de la Imagen */}
                    <Form.Group controlId="formImage" className="mb-3">
                        <Form.Label>URL de la Imagen</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce la URL de la imagen del producto"
                            name="image"
                            value={product.image}
                            onChange={handleChange}
                            isInvalid={!!errors.image && touched.image}
                            isValid={!errors.image && touched.image && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(product.image)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.image}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            ¡URL válida!
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Conteo de Votos (Rating) */}
                    <Form.Group controlId="formRatingCount" className="mb-3">
                        <Form.Label>Conteo de Votos (Rating)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Introduce el conteo de votos"
                            name="ratingCount"
                            value={product.rating?.count || ""}
                            onChange={handleChange}
                            isInvalid={!!errors.ratingCount && touched.ratingCount}
                            isValid={!errors.ratingCount && touched.ratingCount && parseInt(product.rating?.count) >= 0}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.ratingCount}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            ¡Conteo válido!
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Tasa de Votos (Rating) */}
                    <Form.Group controlId="formRatingRate" className="mb-3">
                        <Form.Label>Tasa de Votos (Rating)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            placeholder="Introduce la tasa de votos"
                            name="ratingRate"
                            value={product.rating?.rate || ""}
                            onChange={handleChange}
                            isInvalid={!!errors.ratingRate && touched.ratingRate}
                            isValid={!errors.ratingRate && touched.ratingRate && parseFloat(product.rating?.rate) >= 1 && parseFloat(product.rating?.rate) <= 5}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.ratingRate}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            ¡Tasa válida!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Producto"
                        )}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductFormModal;