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

        // Balansni yangilash: xarajat miqdorini cashBalance dan ayirish
        balance.cashBalance -= expenseAmount;

        // Agar balans manfiy bo'lsa, error qaytarish
        if (balance.cashBalance < 0) {
            return res.status(400).json({ message: 'Balans yetarli emas' });
        }

        // Balansni saqlash
        await balance.save();

        // Xarajat qo'shish
        const newExpense = new Expense({ description, amount: expenseAmount });
        await newExpense.save();

        res.status(201).json({
            message: 'Xarajat muvaffaqiyatli qo\'shildi va balans yangilandi',
            newExpense,
            updatedBalance: balance.cashBalance
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

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
