const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Balance = require('../models/Balance');

// Xarajat qo'shish va balansni yangilash
router.post('/', async (req, res) => {
    const { description, amount } = req.body;

    try {
        // Balansni tekshirish
        const balance = await Balance.findOne();
        if (!balance) {
            return res.status(404).json({ message: 'Balans topilmadi' });
        }

        // Xarajat miqdorini son ko'rinishiga keltirish
        const expenseAmount = parseFloat(amount);
        if (isNaN(expenseAmount)) {
            return res.status(400).json({ message: 'Miqdori noto\'g\'ri formatda' });
        }

        // Xarajat qo'shish
        const newExpense = new Expense({ description, amount: expenseAmount });
        await newExpense.save();

        // Balansni yangilash
        balance.cashBalance -= expenseAmount; // Miqdorni ayirish
        await balance.save();

        res.status(201).json({
            message: 'Xarajat muvaffaqiyatli qo\'shildi va balans yangilandi',
            newExpense,
            updatedBalance: balance.cashBalance
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
