import { db } from "../FireBaseConfig"; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Form, Button, Table, Modal, Spinner } from "react-bootstrap"; 
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"; 


function ProductManager() {
    const [products, setProducts] = useState([]);
    const productsCollectionRef = collection(db, "products"); 
    // Estado para el nuevo producto
    const [newProduct, setNewProduct] = useState({
        title: "",
        category: "",
        description: "",
        price: 0,
        image: "",
        rating: {
            count: 0,
            rate: 0
        }
    });
    
    // Estado para controlar la visibilidad del modal
    const [showAddProductModal, setShowAddProductModal] = useState(false);

    // Función para abrir el modal
    const handleShowAddProductModal = () => setShowAddProductModal(true);
    // Función para cerrar el modal y resetear el formulario
    const handleCloseAddProductModal = () => {
        setShowAddProductModal(false);
        // Resetea el formulario al cerrar el modal
        setNewProduct({
            title: "",
            category: "",
            description: "",
            price: 0,
            image: "",
            rating: {
                count: 0,
                rate: 0
            }
        });
    };
    const [isLoading, setIsLoading] = useState(false);
    
     // Manejador del envío del formulario dentro del modal
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Activa el spinner para el proceso de añadir

        const addSuccess = await addProduct(newProduct); 
        
        setIsLoading(false); // Desactiva el spinner

        const MySwal = withReactContent(Swal);
        if (!addSuccess) {
            MySwal.fire({
                title: "Error",
                text: "Error al agregar el producto",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        } else {
            MySwal.fire({
                title: "Éxito",
                text: "Producto agregado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            handleCloseAddProductModal(); 
        }
    };

    // Función para obtener productos de Firestore
    const getProducts = async () => {
        try {
            const data = await getDocs(productsCollectionRef);
            setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
            console.error("Error al obtener productos:", error);
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: "Error",
                text: "No se pudieron cargar los productos.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    // Función para agregar un producto a Firestore
    const addProduct = async (productData) => { 
        try {
            const addedDocRef = await addDoc(productsCollectionRef, productData);
            console.log("Producto agregado con ID:", addedDocRef.id);
            await getProducts(); // Vuelve a cargar la lista de productos
            return true;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            return false;
        }
    };

    // Función para eliminar un producto de Firestore
    const deleteProduct = async (id) => {
        const MySwal = withReactContent(Swal);
        const result = await MySwal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                const productDoc = doc(db, "products", id);
                await deleteDoc(productDoc);
                await getProducts(); // Vuelve a cargar la lista
                MySwal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                MySwal.fire("Error", "No se pudo eliminar el producto.", "error");
            }
        }
    };

    // Función para actualizar un producto en Firestore
    const updateProduct = async (id, updatedProductData) => {
        try {
            const productDocRef = doc(db, "products", id);
            await updateDoc(productDocRef, updatedProductData);
            await getProducts(); // Vuelve a cargar la lista
            const MySwal = withReactContent(Swal);
            MySwal.fire("Actualizado!", "El producto ha sido actualizado.", "success");
            return true;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            const MySwal = withReactContent(Swal);
            MySwal.fire("Error", "No se pudo actualizar el producto.", "error");
            return false;
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        //Lista productos en forma de tabla con botones para agregar, eliminar y actualizar
        //Los produtos tienen titulo, categoria, descripción, precio, url de imagen , un rating.count y un rating.rate
        <div className="container mt-5">
            <h2>Product Manager</h2>
            
            {/* Botón para abrir el modal de agregar producto */}
            <Button variant="primary" onClick={handleShowAddProductModal} className="mb-3">
                Agregar Nuevo Producto
            </Button>

            {/* Modal para agregar productos */}
            <Modal show={showAddProductModal} onHide={handleCloseAddProductModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nuevo Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Aquí va todo el formulario de agregar producto */}
                        <Form.Group controlId="formAddTitle" className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product title"
                                name="title"
                                value={newProduct.title}
                                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddCategory" className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product category"
                                name="category"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddDescription" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea" // Cambiado a textarea para descripciones más largas
                                rows={3}
                                placeholder="Enter product description"
                                name="description"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddPrice" className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter product price"
                                name="price"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddImage" className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product image URL"
                                name="image"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddRatingCount" className="mb-3">
                            <Form.Label>Rating Count</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter rating count"
                                name="ratingCount"
                                value={newProduct.rating.count}
                                onChange={(e) => setNewProduct({ ...newProduct, rating: { ...newProduct.rating, count: parseInt(e.target.value) } })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddRatingRate" className="mb-3">
                            <Form.Label>Rating Rate</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.1" // Permite números decimales para el rating
                                placeholder="Enter rating rate"
                                name="ratingRate"
                                value={newProduct.rating.rate}
                                onChange={(e) => setNewProduct({ ...newProduct, rating: { ...newProduct.rating, rate: parseFloat(e.target.value) } })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Agregando...
                                </>
                            ) : (
                                "Agregar Producto"
                            )}
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddProductModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Tabla de productos existente */}
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Imagen</th>
                        <th>Rating (Count/Rate)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">No hay productos disponibles.</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.title}</td>
                                <td>{product.category}</td>
                                <td>${product.price ? product.price.toFixed(2) : 'N/A'}</td> {/* Formato de precio */}
                                <td>
                                    {product.image && (
                                        <img src={product.image} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                    )}
                                </td>
                                <td>{product.rating?.count || 0} / {product.rating?.rate || 0}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => deleteProduct(product.id)} className="me-2">Eliminar</Button>
                                    {/* Botón de edición aquí (tarea futura) */}
                                    <Button variant="info" size="sm" onClick={() => {/* Lógica de edición */}}>Editar</Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
        
    );
}
export default ProductManager;