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
        // MongoDB agregatsiya ramkasidan foydalanib purchasePrice ni hisoblang
        const result = await Product.aggregate([
            {
                // Faqat quantity 0 dan katta bo'lgan hujjatlarni tanlash
                $match: {
                    quantity: { $gt: 0 }
                }
            },
            {
                // Hujjatlarni guruhlash va `purchasePrice` ni yig'ish
                $group: {
                    _id: null, // Bizga hech qanday maxsus maydon bo'yicha guruhlash kerak emas
                    totalPurchasePrice: { $sum: "$purchasePrice" }
                }
            }
        ]);

        // Agar natija bo'sh bo'lsa, totalPurchasePrice ni 0 ga tenglang
        const totalPurchasePrice = result.length > 0 ? result[0].totalPurchasePrice : 0;

        // totalPurchasePrice ni javob sifatida yuboring
        res.status(200).json({ totalPurchasePrice });
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
