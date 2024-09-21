const express = require('express');
const ProductManager = require('../managers/productManager');
const router = express.Router();

const productManager = new ProductManager();

// Ruta raíz GET / - lista todos los productos con limitación opcional
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    try {
        const products = productManager.getAllProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta GET /:pid - obtiene un producto por su ID
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    // Verifica si el parámetro ID es un número válido
    if (isNaN(productId)) {
        return res.status(400).json({ error: 'El ID proporcionado no es un número válido' });
    }

    try {
        const product = productManager.getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta POST / - agrega un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const newProduct = productManager.addProduct({
            title, description, code, price, status: status ?? true, stock, category, thumbnails
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Ruta PUT /:pid - actualiza un producto por su ID
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
        return res.status(400).json({ error: 'El ID proporcionado no es un número válido' });
    }

    try {
        const updatedProduct = productManager.updateProduct(productId, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta DELETE /:pid - elimina un producto por su ID
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
        return res.status(400).json({ error: 'El ID proporcionado no es un número válido' });
    }

    try {
        const isDeleted = productManager.deleteProduct(productId);
        if (!isDeleted) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
