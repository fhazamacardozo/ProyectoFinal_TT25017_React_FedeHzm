// src/components/ProductFormModal.jsx
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
    // Protección adicional para 'product' en caso de que sea null inicialmente
    if (!product) {
        return null; // O un spinner si prefieres mostrar algo mientras se carga
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="formTitle" className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce el título del producto"
                            name="title"
                            value={product.title}
                            onChange={(e) => setProduct({ ...product, title: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategory" className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce la categoría del producto"
                            name="category"
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Introduce la descripción del producto"
                            name="description"
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            required
                        />
                    </Form.Group>
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
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formImage" className="mb-3">
                        <Form.Label>URL de la Imagen</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce la URL de la imagen del producto"
                            name="image"
                            value={product.image}
                            onChange={(e) => setProduct({ ...product, image: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formRatingCount" className="mb-3">
                        <Form.Label>Conteo de Votos (Rating)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Introduce el conteo de votos"
                            name="ratingCount"
                            value={product.rating?.count || ""} // Asegura que no sea undefined
                            onChange={(e) =>
                                setProduct({
                                ...product,
                                rating: {
                                    ...product.rating,
                                    count: e.target.value === "" ? "" : parseInt(e.target.value),
                                },
                                })
                            }
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formRatingRate" className="mb-3">
                        <Form.Label>Tasa de Votos (Rating)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            placeholder="Introduce la tasa de votos"
                            name="ratingRate"
                            value={product.rating?.rate || ""} // Asegura que no sea undefined
                            onChange={(e) =>
                                setProduct({
                                ...product,
                                rating: {
                                    ...product.rating,
                                    rate: e.target.value === "" ? "" : parseFloat(e.target.value),
                                },
                                })
                            }
                            required
                        />
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