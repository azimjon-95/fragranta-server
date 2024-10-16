const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Create product
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/total-purchase-price', async (req, res) => {
    try {
        // Barcha mahsulotlarni olish
        const products = await Product.find();

        // Har bir mahsulotning purchasePrice * quantity ni ko'paytirish va jamlash
        const totalPurchasePrice = products.reduce((total, product) => {
            const productTotal = product.purchasePrice * product.quantity; // purchasePrice * quantity
            return total + productTotal; // Natijani jamlash
        }, 0); // 0 boshlang'ich qiymat

        res.status(200).json({ totalPurchasePrice }); // Umumiy natijani qaytarish
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;



