const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productos.json');

class ProductManager {
    getAllProducts(limit) {
        try {
            const productsData = fs.readFileSync(productsFilePath, 'utf-8');
            const products = JSON.parse(productsData);
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            throw new Error('Error al leer los productos');
        }
    }

    getProductById(id) {
        const products = this.getAllProducts();
        return products.find(product => product.id === id);
    }

    addProduct(productData) {
        const products = this.getAllProducts();
        const newId = products.length ? products[products.length - 1].id + 1 : 1;
        const newProduct = { id: newId, status: true, ...productData };
        products.push(newProduct);

        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    updateProduct(id, productData) {
        const products = this.getAllProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;

        const updatedProduct = { ...products[productIndex], ...productData };
        products[productIndex] = updatedProduct;

        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        return updatedProduct;
    }

    deleteProduct(id) {
        let products = this.getAllProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;

        products = products.filter(product => product.id !== id);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        return true;
    }
}

module.exports = ProductManager;
