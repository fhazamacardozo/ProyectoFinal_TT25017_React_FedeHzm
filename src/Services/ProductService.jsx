import { db } from "../FireBaseConfig"; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const productsCollectionRef = collection(db, "products");

/**
 * Obtiene todos los productos de Firestore.
 * @returns {Array} Una promesa que resuelve con un array de productos.
 */
export const getProductsFromDb = async () => {
    const data = await getDocs(productsCollectionRef);
    return data.docs.map((document) => ({ ...document.data(), id: document.id }));
};

/**
 * Agrega un nuevo producto a Firestore.
 * @param {Object} productData Los datos del producto a agregar.
 * @returns {string} El ID del documento agregado.
 */
export const addProductToDb = async (productData) => {
    // Asegurarse de que los datos numéricos estén en el formato correcto
    const dataToSend = {
        ...productData,
        price: parseFloat(productData.price),
        rating: {
            count: parseInt(productData.rating.count),
            rate: parseFloat(productData.rating.rate),
        },
    };
    const docRef = await addDoc(productsCollectionRef, dataToSend);
    // Return the product object with Firestore ID
    return { ...productData, id: docRef.id };
};

/**
 * Actualiza un producto existente en Firestore.
 * @param {string} id El ID del producto a actualizar.
 * @param {Object} updatedProductData Los nuevos datos del producto.
 */
export const updateProductInDb = async (id, updatedProductData) => {
    // Asegurarse de que los datos numéricos estén en el formato correcto
    const dataToSend = {
        ...updatedProductData,
        price: parseFloat(updatedProductData.price),
        rating: {
            count: parseInt(updatedProductData.rating.count),
            rate: parseFloat(updatedProductData.rating.rate),
        },
    };
    const productDocRef = doc(db, "products", id);
    await updateDoc(productDocRef, dataToSend);
};

/**
 * Elimina un producto de Firestore.
 * @param {string} id El ID del producto a eliminar.
 */
export const deleteProductFromDb = async (id) => {
    const productDocRef = doc(db, "products", id);
    await deleteDoc(productDocRef);
};

/**
 * Agrega múltiples productos a Firestore desde un array.
 * @param {Array<Object>} productsArray Un array de objetos de productos a agregar.
 * @returns {Object} Un objeto con el conteo de subidas exitosas y fallidas.
 */
export const addProductsFromJsonToDb = async (productsArray) => {
    let uploadedCount = 0;
    let failedCount = 0;
    const errors = []; // Para almacenar los errores detallados

    const uploadPromises = productsArray.map(async (product, index) => {
        try {
            // Asegurarse de que los datos numéricos estén en el formato correcto
            const dataToSend = {
                ...product,
                price: parseFloat(product.price),
                rating: {
                    count: parseInt(product.rating.count),
                    rate: parseFloat(product.rating.rate),
                },
            };
            const docRef = await addDoc(productsCollectionRef, dataToSend);
            uploadedCount++;
            // Push product object with Firestore ID
            return { status: 'success', product: { ...product, id: docRef.id } };
        } catch (error) {
            failedCount++;
            const errorMessage = `Error subiendo producto "${product.title || `índice ${index}`}" a DB: ${error.message}`;
            console.error(errorMessage, error);
            errors.push(errorMessage);
            return { status: 'failed', productTitle: product.title, error: errorMessage };
        }
    });

    // Esperar a que todas las promesas se resuelvan (no falla si una sola falla)
    const results = await Promise.all(uploadPromises);

    return {
        uploadedCount,
        failedCount,
        errors,
        results 
    };
};