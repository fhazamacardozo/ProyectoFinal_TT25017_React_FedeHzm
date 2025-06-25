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
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (show) {
            setErrors({});
            setTouched({});
        }
    }, [show]);

    if (!product) {
        return null;
    }

    // --- Validation Logic ---
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "title": {
                if (!value.trim()) {
                    error = "El título es obligatorio.";
                }
                break;
            }
            case "category": {
                if (!value.trim()) {
                    error = "La categoría es obligatoria.";
                }
                break;
            }
            case "description": {
                if (!value.trim()) {
                    error = "La descripción es obligatoria.";
                } else if (value.trim().length < 10) {
                    error = `La descripción debe tener al menos 10 caracteres. Faltan ${10 - value.trim().length}.`;
                }
                break;
            }
            case "price": {
                const priceValue = parseFloat(value);
                if (value === "" || isNaN(priceValue)) {
                    error = "El precio es obligatorio.";
                } else if (priceValue <= 0) {
                    error = "El precio debe ser mayor a 0.";
                }
                break;
            }
            case "image": {
                if (!value.trim()) {
                    error = "La URL de la imagen es obligatoria.";
                }
                // *** MODIFICACIÓN AQUÍ para la URL de la imagen ***
                // Esta regex es más flexible. Permite URLs que parecen válidas sin exigir una extensión.
                // Si necesitas una validación más estricta de "es una imagen real",
                // eso es mejor hacerlo en el backend o con una API de terceros.
                else if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value)) {
                    error = "Introduce una URL válida (ej. http://example.com/imagen.jpg o http://cdn.com/id/imagen).";
                }
                break;
            }
            case "ratingCount": {
                const countValue = parseInt(value);
                if (value === "" || isNaN(countValue)) {
                    error = "El conteo de votos es obligatorio.";
                }
                // *** MODIFICACIÓN AQUÍ para ratingCount: no permitir cero ***
                else if (countValue <= 0) { // Cambiado de < 0 a <= 0
                    error = "El conteo de votos no puede ser negativo o cero.";
                }
                break;
            }
            case "ratingRate": {
                const rateValue = parseFloat(value);
                if (value === "" || isNaN(rateValue)) {
                    error = "La tasa de votos es obligatoria.";
                } else if (rateValue < 1 || rateValue > 5) {
                    error = "La tasa de votos debe estar entre 1 y 5.";
                }
                break;
            }
            default:
                break;
        }
        return error;
    };

    const validateAllFields = () => {
        const newErrors = {};
        const allFieldsTouched = {};

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
            const error = validateField(name, value);
            if (error) {
                newErrors[name] = error;
            }
            allFieldsTouched[name] = true;
        });

        setErrors(newErrors);
        setTouched(allFieldsTouched);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedProduct = { ...product };

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

        const error = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateAllFields()) {
            onSubmit(e);
        }
    };

    const isFieldValid = (name) => {
        const hasNoError = !errors[name];
        const isTouched = touched[name];

        if (!isTouched) return false;

        switch (name) {
            case "title":
            case "category":
                return hasNoError && product[name] && product[name].trim() !== "";
            case "image":
                // *** MODIFICACIÓN AQUÍ para isFieldValid de la imagen ***
                // Usa la misma lógica que en validateField para la validez
                return hasNoError && product.image && /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(product.image);
            case "description":
                return hasNoError && product.description && product.description.trim().length >= 10;
            case "price":
                return hasNoError && typeof product.price === 'number' && parseFloat(product.price) > 0;
            case "ratingCount":
                // *** MODIFICACIÓN AQUÍ para isFieldValid de ratingCount: no permitir cero ***
                return hasNoError && typeof product.rating?.count === 'number' && parseInt(product.rating.count) > 0; // Cambiado de >= 0 a > 0
            case "ratingRate":
                return hasNoError && typeof product.rating?.rate === 'number' && parseFloat(product.rating.rate) >= 1 && parseFloat(product.rating.rate) <= 5;
            default:
                return false;
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} noValidate>
                    {/* Título */}
                    <Form.Group controlId="formTitle" className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce el título del producto"
                            name="title"
                            value={product.title}
                            onChange={handleChange}
                            isInvalid={!!errors.title && touched.title}
                            isValid={isFieldValid("title")}
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
                            isValid={isFieldValid("category")}
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
                            isValid={isFieldValid("description")}
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
                            isValid={isFieldValid("price")}
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
                            isValid={isFieldValid("image")}
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
                            isValid={isFieldValid("ratingCount")}
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
                            isValid={isFieldValid("ratingRate")}
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