import { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ProductFormModal from "../Components/ProductFormModal"; 
import { initialProductState } from "../Utils/InitialProductState"; 
import { 
        getProductsFromDb,
        addProductToDb,
        updateProductInDb,
        deleteProductFromDb, } 
    from "../Services/ProductService,jsx";

function ProductManager() {
    const [products, setProducts] = useState([]);

    // Estado para el nuevo producto (para el modal de agregar)
    const [newProduct, setNewProduct] = useState(initialProductState);
    // Estado para el producto que se está editando
    const [editingProduct, setEditingProduct] = useState(null);

    // Estados para controlar la visibilidad de los modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false); // Para el spinner de guardado/actualización
    const [isDeletingId, setIsDeletingId] = useState(null); //para spinner de eliminación

    const MySwal = withReactContent(Swal); // Instancia de SweetAlert2

    // --- Funciones para abrir/cerrar modales ---
    const handleShowAddModal = () => {
        setNewProduct(initialProductState); // Asegura que el formulario de agregar esté limpio
        setShowAddModal(true);
    };
    const handleCloseAddModal = () => setShowAddModal(false);

    const handleShowEditModal = (product) => {
        // Asegurarse de que los valores numéricos sean cadenas para los inputs del formulario
        const productForEdit = {
        ...product,
        price: product.price !== undefined && product.price !== null ? String(product.price) : "",
        rating: {
            ...product.rating,
            count: product.rating?.count !== undefined && product.rating?.count !== null ? String(product.rating.count) : "",
            rate: product.rating?.rate !== undefined && product.rating?.rate !== null ? String(product.rating.rate) : ""
        }
        };
        setEditingProduct(productForEdit);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingProduct(null); // Limpiar el producto en edición
    };

    // --- Funciones CRUD (ahora llaman al servicio) ---

  // Obtener productos
  const fetchProducts = async () => { // Cambiado el nombre para evitar confusión con la función importada
        try {
            const fetchedProducts = await getProductsFromDb(); // <--- Llamada al servicio
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            MySwal.fire({
                title: "Error",
                text: "No se pudieron cargar los productos.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

  // Agregar un producto
  const handleAddProduct = async (productData) => { // Cambiado el nombre a 'handle'
    try {
        await addProductToDb(productData); // <--- Llamada al servicio
        await fetchProducts(); // Recargar la lista
        return true;
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        return false;
    }
};

  // Actualizar un producto
  const handleUpdateProduct = async (id, productData) => { // Cambiado el nombre a 'handle'
    try {
      await updateProductInDb(id, productData); // <--- Llamada al servicio
      await fetchProducts(); // Recargar la lista
        return true;
    } 
    catch (error) {
        console.error("Error al actualizar el producto:", error);
        return false;
    }
    };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => { // Cambiado el nombre a 'handle'
        const result = await MySwal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            setIsDeletingId(id);
            try {
                await deleteProductFromDb(id); // <--- Llamada al servicio
                await fetchProducts(); // Recargar la lista
                MySwal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                MySwal.fire("Error", "No se pudo eliminar el producto.", "error");
            } finally {
                setIsDeletingId(null);
            }
            }
    };

    // --- Manejador de Submit Unificado ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let success = false;
        if (showAddModal) {
        success = await handleAddProduct(newProduct);
        } else if (showEditModal && editingProduct) {
        success = await handleUpdateProduct(editingProduct.id, editingProduct);
        }

        setIsLoading(false);

        if (!success) {
        MySwal.fire({
            title: "Error",
            text: showAddModal
            ? "Error al agregar el producto"
            : "Error al actualizar el producto",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        } else {
        MySwal.fire({
            title: "Éxito",
            text: showAddModal
            ? "Producto agregado correctamente"
            : "Producto actualizado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
        });
        // Cerrar el modal correspondiente
        showAddModal ? handleCloseAddModal() : handleCloseEditModal();
        }
    };

    useEffect(() => {
        fetchProducts(); 
    }, []);

    return (
        <div className="container mt-5">
        <h2>Gestor de Productos</h2>

        {/* Botones para abrir modales */}
        <Button variant="primary" onClick={handleShowAddModal} className="mb-3 me-2">
            Agregar Nuevo Producto
        </Button>
        {/* Modal para Agregar Producto */}
            <ProductFormModal
                show={showAddModal}
                onHide={handleCloseAddModal}
                product={newProduct}
                setProduct={setNewProduct}
                onSubmit={handleSubmit}
                title="Agregar Nuevo Producto"
                isLoading={isLoading}
            />

        {/* Modal para Editar Producto */}
        {editingProduct && ( // Solo renderiza si hay un producto para editar
            <ProductFormModal
                show={showEditModal}
                onHide={handleCloseEditModal}
                product={editingProduct}
                setProduct={setEditingProduct}
                onSubmit={handleSubmit}
                title="Editar Producto"
                isLoading={isLoading}
            />
        )}

        {/* Tabla de productos */}
        <Table striped bordered hover responsive className="mt-3">
            <thead>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Imagen</th>
                <th>Rating (Votos/Tasa)</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {products.length === 0 ? (
                <tr>
                <td colSpan="7" className="text-center">
                    No hay productos disponibles.
                </td>
                </tr>
            ) : (
                products.map((product) => (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>${product.price !== undefined && product.price !== null ? product.price.toFixed(2) : "N/A"}</td>
                    <td>
                    {product.image && (
                        <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                    )}
                    </td>
                    <td>
                    {product.rating?.count || 0} / {product.rating?.rate || 0}
                    </td>
                    <td>
                    <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowEditModal(product)}
                        className="me-2"
                    >
                        Editar
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        // Deshabilita el botón si este producto se está eliminando
                        // y muestra el spinner.
                        disabled={isDeletingId === product.id}
                        onClick={() => handleDeleteProduct(product.id)}
                    >
                        {isDeletingId === product.id ? (
                            <>
                                <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-1" // Espacio entre spinner y texto
                                />
                                Eliminando...
                            </>
                        ) : (
                            "Eliminar"
                        )}
                    </Button>
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