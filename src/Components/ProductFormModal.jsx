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

    // Reset errors when the modal is shown or product changes
    useEffect(() => {
        if (show) {
            setErrors({});
        }
    }, [show, product]);

    // Protección adicional para 'product' en caso de que sea null inicialmente
    if (!product) {
        return null; // O un spinner si prefieres mostrar algo mientras se carga
    }

    const validateForm = () => {
        const newErrors = {};

        // Validaciones para campos obligatorios
        if (!product.title.trim()) {
            newErrors.title = "El título es obligatorio.";
        }
        if (!product.category.trim()) {
            newErrors.category = "La categoría es obligatoria.";
        }
        if (!product.description.trim()) {
            newErrors.description = "La descripción es obligatoria.";
        } else if (product.description.trim().length < 10) {
            newErrors.description = "La descripción debe tener al menos 10 caracteres.";
        }
        if (product.price === "" || product.price === null || isNaN(product.price)) {
            newErrors.price = "El precio es obligatorio.";
        } else if (product.price <= 0) {
            newErrors.price = "El precio debe ser mayor a 0.";
        }
        if (!product.image.trim()) {
            newErrors.image = "La URL de la imagen es obligatoria.";
        } 

        // Validaciones para rating
        if (product.rating?.count === "" || product.rating?.count === null || isNaN(product.rating?.count)) {
            newErrors.ratingCount = "El conteo de votos es obligatorio.";
        } else if (parseInt(product.rating.count) < 0) {
            newErrors.ratingCount = "El conteo de votos no puede ser negativo.";
        }

        if (product.rating?.rate === "" || product.rating?.rate === null || isNaN(product.rating?.rate)) {
            newErrors.ratingRate = "La tasa de votos es obligatoria.";
        } else if (parseFloat(product.rating.rate) < 1 || parseFloat(product.rating.rate) > 5) {
            newErrors.ratingRate = "La tasa de votos debe estar entre 1 y 5.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
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
                <Form onSubmit={handleSubmit}>
                    {/* Título */}
                    <Form.Group controlId="formTitle" className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce el título del producto"
                            name="title"
                            value={product.title}
                            onChange={(e) => setProduct({ ...product, title: e.target.value })}
                            isInvalid={!!errors.title} // Marca el campo como inválido si hay error
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
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
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            isInvalid={!!errors.category}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.category}
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
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
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
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    price: e.target.value === "" ? "" : parseFloat(e.target.value),
                                })
                            }
                            isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.price}
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
                            onChange={(e) => setProduct({ ...product, image: e.target.value })}
                            isInvalid={!!errors.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.image}
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
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    rating: {
                                        ...product.rating,
                                        count: e.target.value === "" ? "" : parseInt(e.target.value),
                                    },
                                })
                            }
                            isInvalid={!!errors.ratingCount}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.ratingCount}
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
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    rating: {
                                        ...product.rating,
                                        rate: e.target.value === "" ? "" : parseFloat(e.target.value),
                                    },
                                })
                            }
                            isInvalid={!!errors.ratingRate}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.ratingRate}
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