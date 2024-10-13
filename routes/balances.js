const express = require('express');
const router = express.Router();
const Balance = require('../models/Balance');

// Get current balances
router.get('/', async (req, res) => {
    try {
        const balance = await Balance.findOne();
        res.status(200).json(balance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update balances
router.post('/update', async (req, res) => {
    const { cashBalance } = req.body; // Keluvchi ma'lumotlar

    try {
        // Balansni yangilash
        const balance = await Balance.findOne(); // Agar faqat bitta balans bo'lsa

        if (!balance) {
            return res.status(404).json({ message: 'Balans topilmadi' });
        }

        // Yangilanishlar
        balance.creditBalance -= cashBalance; // Kredit balansidan chiqarish
        balance.cashBalance += cashBalance; // Yana pul qo'shish

        await balance.save(); // O'zgarishlarni saqlash
        res.status(200).json({ message: 'Balans yangilandi', balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

