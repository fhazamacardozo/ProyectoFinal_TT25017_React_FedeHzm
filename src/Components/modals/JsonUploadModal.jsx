import { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * @typedef {object} ProductData
 * @property {string} title
 * @property {string} category
 * @property {string} description
 * @property {number} price
 * @property {string} image
 * @property {{rate: number, count: number}} rating
 */

/**
 * A reusable modal component for uploading a JSON file containing a list of products.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {function} props.onHide - Callback function to hide the modal.
 * @param {function(ProductData[]): Promise<void>} props.onProductsLoaded - Callback function called when products are successfully loaded and validated. It receives an array of products.
 * @param {string} [props.title='Cargar Productos desde JSON'] - The title of the modal.
 */
function JsonUploadModal({ show, onHide, onProductsLoaded, title = 'Cargar Productos desde JSON' }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Reset state when the modal is hidden
    const handleHide = () => {
        setFile(null);
        setIsLoading(false);
        setError('');
        setSuccessMessage('');
        onHide();
    };

    /**
     * Handles the file input change event.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check if the file is a JSON file
            if (selectedFile.type !== 'application/json') {
                setError('Por favor, selecciona un archivo JSON válido (.json).');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(''); // Clear previous error
            setSuccessMessage(''); // Clear success message on new file selection
        }
    };

    /**
     * Handles the form submission to process the JSON file.
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecciona un archivo para cargar.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const content = event.target.result;
                const products = JSON.parse(content);

                // --- Validation of the JSON structure ---
                if (!Array.isArray(products)) {
                    throw new Error('El archivo JSON debe contener un array de productos.');
                }
                if (products.length === 0) {
                    throw new Error('El archivo JSON no contiene productos.');
                }

                // --- More detailed product validation (optional but recommended) ---
                const validatedProducts = products.map((product, index) => {
                    // Check for required fields and types
                    const requiredFields = ['title', 'category', 'description', 'price', 'image', 'rating'];
                    const missingFields = requiredFields.filter(field => product[field] === undefined);
                    if (missingFields.length > 0) {
                        throw new Error(`Producto en la línea ${index + 1} del JSON está incompleto. Faltan campos: ${missingFields.join(', ')}.`);
                    }

                    // Check data types and values
                    if (typeof product.title !== 'string' || !product.title.trim()) throw new Error(`El título del producto ${index + 1} no es válido.`);
                    if (typeof product.category !== 'string' || !product.category.trim()) throw new Error(`La categoría del producto ${index + 1} no es válida.`);
                    if (typeof product.description !== 'string' || product.description.trim().length < 10) throw new Error(`La descripción del producto ${index + 1} es muy corta.`);
                    if (typeof product.price !== 'number' || product.price <= 0) throw new Error(`El precio del producto ${index + 1} no es válido.`);
                    if (typeof product.image !== 'string' || !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(product.image)) throw new Error(`La URL de la imagen del producto ${index + 1} no es válida.`);
                    if (typeof product.rating !== 'object' || product.rating === null) throw new Error(`El rating del producto ${index + 1} no es válido.`);
                    if (typeof product.rating.rate !== 'number' || product.rating.rate < 1 || product.rating.rate > 5) throw new Error(`La tasa de rating del producto ${index + 1} debe estar entre 1 y 5.`);
                    if (typeof product.rating.count !== 'number' || product.rating.count <= 0) throw new Error(`El conteo de rating del producto ${index + 1} debe ser mayor a 0.`);

                    return product; // Return the product if it passes all validations
                });

                // Call the success callback with the validated products
                await onProductsLoaded(validatedProducts);
                setSuccessMessage(`¡Éxito! ${validatedProducts.length} producto(s) cargado(s) correctamente.`);
                // Reset file input after successful load
                setFile(null); 
                // Don't hide the modal automatically, let the user close it.
                // handleHide(); // You can choose to hide it here if you want.

            } catch (err) {
                console.error("Error processing JSON file:", err);
                setError(`Error al procesar el archivo: ${err.message || 'Formato JSON inválido.'}`);
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setIsLoading(false);
            setError('Error al leer el archivo. Por favor, inténtalo de nuevo.');
        };

        reader.readAsText(file);
    };

    return (
        <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Selecciona un archivo JSON con la siguiente estructura:</p>
                <pre><code>{`[
                    {
                        "id": 1,
                        "title": "...",
                        "price": 109.95,
                        "description": "...",
                        "category": "...",
                        "image": "...",
                        "rating": {
                        "rate": 3.9,
                        "count": 120
                        }
                    },
                    ...
                ]`
                }</code></pre>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="jsonFile" className="mb-3">
                        <Form.Label>Archivo JSON</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            isInvalid={!!error}
                        />
                        <Form.Control.Feedback type="invalid">
                            {error}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!file || isLoading}
                        className="me-2"
                    >
                        {isLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Cargando...
                            </>
                        ) : (
                            'Cargar Archivo'
                        )}
                    </Button>
                    <Button variant="secondary" onClick={handleHide} disabled={isLoading}>
                        Cancelar
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

JsonUploadModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onProductsLoaded: PropTypes.func.isRequired,
    title: PropTypes.string,
};

export default JsonUploadModal;