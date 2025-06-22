// src/components/ProductList.js o src/components/ProductForm.js
import { db } from "../FireBaseConfig"; // Importa la instancia de Firestore
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap"; // Importa Form de react-bootstrap
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"; 


function ProductManager() {
    const [products, setProducts] = useState([]);
    const productsCollectionRef = collection(db, "products"); // Referencia a tu colección de productos
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
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const title = e.target.title.value;
        const category = e.target.category.value;  
        const description = e.target.description.value;
        const price = parseFloat(e.target.price.value);
        const image = e.target.image.value;
        const ratingCount = parseInt(e.target.ratingCount.value);
        const ratingRate = parseFloat(e.target.ratingRate.value);
        const newProduct = {
            title,
            category,
            description,
            price,
            image,
            rating: {
                count: ratingCount,
                rate: ratingRate
            }
        };
        const addSuccess = await addProduct(newProduct);
        console.log("Producto agregado:", addSuccess);
        setIsLoading(false);
        if (!addSuccess) {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: "Error",
                text: "Error al agregar el producto",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        } else {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: "Éxito",
                text: "Producto agregado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
        }
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

    // Función para obtener productos
    const getProducts = async () => {
        const data = await getDocs(productsCollectionRef);
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    // Función para agregar un producto
    const addProduct = async (newProduct) => {
        try {
            const addedProduct=  await addDoc(productsCollectionRef, newProduct);
            getProducts(); // Vuelve a cargar la lista
            console.log("Producto agregado con ID:", addedProduct.id);
            return true; // Producto agregado exitosamente
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            return false; // Error al agregar el producto       
        }
    };

    // Función para eliminar un producto
    const deleteProduct = async (id) => {
        const productDoc = doc(db, "products", id);
        await deleteDoc(productDoc);
        getProducts();
    };
    // Función para actualizar un producto
    const updateProduct = async (id, updatedProduct) => {      
        const productDoc = doc(db, "products", id);
        await updateDoc(productDoc, updatedProduct);
        getProducts();
    } 

    useEffect(() => {
        getProducts();
    }, []);

    return (
        //Lista productos en forma de tabla con botones para agregar, eliminar y actualizar
        //Los produtos tienen titulo, categoria, descripción, precio, url de imagen , un rating.count y un rating.rate
        <div className="container mt-5">
            <h2>Product Manager</h2>
            <Form onSubmit={handleSubmit} className="w-50 mx-auto">
                <Form.Group controlId="formBasicTitle" className="mb-3">    
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
                <Form.Group controlId="formBasicCategory" className="mb-3">
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
                <Form.Group controlId="formBasicDescription" className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter product description"
                        name="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formBasicPrice" className="mb-3">
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
                <Form.Group controlId="formBasicImage" className="mb-3">
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
                <Form.Group controlId="formBasicRatingCount" className="mb-3">
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
                <Form.Group controlId="formBasicRatingRate" className="mb-3">
                    <Form.Label>Rating Rate</Form.Label>    
                    <Form.Control
                        type="number"
                        placeholder="Enter rating rate"
                        name="ratingRate"
                        value={newProduct.rating.rate}
                        onChange={(e) => setNewProduct({ ...newProduct, rating: { ...newProduct.rating, rate: parseFloat(e.target.value) } })}
                        required    
                    />
                </Form.Group>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Product"}
                </button>
            </Form>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td>
                                <button onClick={() => deleteProduct(product.id)}>Delete</button>
                                {/* Aquí podrías agregar un botón para editar el producto */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
    );
}
export default ProductManager;