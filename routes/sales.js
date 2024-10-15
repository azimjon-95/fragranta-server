const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Balance = require('../models/Balance');


// Get all sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find();
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all sales with profit calculation for 'cash' sale types
router.get('/totalProfit', async (req, res) => {
    try {
        // Use aggregation to calculate total profits for sales with saleType 'cash'
        const result = await Sale.aggregate([
            {
                // Faqat 'cash' turidagi sotuvlarni tanlash
                $match: {
                    saleType: 'cash'
                }
            },
            {
                // Mahsulotlar va foyda hisoblash
                $unwind: '$products' // Har bir sotuv uchun mahsulotlarni ajratish
            },
            {
                // Foyda hisoblash va yangilanish
                $project: {
                    totalProfit: {
                        $multiply: [
                            { $subtract: ['$products.sellPrice', '$products.price'] },
                            '$products.quantity'
                        ]
                    },
                    saleType: 1,
                    totalAmount: 1,
                    totalQuantity: 1,
                    date: 1,
                    products: 1
                }
            },
            {
                // Sotuvlar bo'yicha umumiy foyda
                $group: {
                    _id: '$_id', // Sotuv ID
                    saleType: { $first: '$saleType' },
                    totalAmount: { $first: '$totalAmount' },
                    totalQuantity: { $first: '$totalQuantity' },
                    date: { $first: '$date' },
                    products: { $push: '$products' },
                    totalProfit: { $sum: '$totalProfit' } // Umumiy sof foyda
                }
            },
            {
                // Umumiy foydani hisoblash
                $group: {
                    _id: null, // Umumiy hisob
                    sales: {
                        $push: {
                            _id: '$_id',
                            saleType: '$saleType',
                            totalAmount: '$totalAmount',
                            totalQuantity: '$totalQuantity',
                            date: '$date',
                            products: '$products',
                            totalProfit: '$totalProfit'
                        }
                    },
                    overallProfit: { $sum: '$totalProfit' } // Umumiy foyda
                }
            }
        ]);

        // Return the result with overallProfit
        const response = result.length > 0 ? { sales: result[0].sales, overallProfit: result[0].overallProfit } : { sales: [], overallProfit: 0 };

        res.status(200).json(response.overallProfit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a sale (cash or credit)
// Sotuvni yaratish (naqd yoki kredit)
router.post('/', async (req, res) => {
    const { products, saleType, buyerDetails } = req.body;

    try {
        // Umumiy summani hisoblash
        const totalAmount = products.reduce((acc, productInfo) => acc + (productInfo.sellPrice * productInfo.quantity), 0);
        const totalQuantity = products.reduce((acc, productInfo) => acc + productInfo.quantity, 0);
        const quantities = products.reduce((acc, productInfo) => {
            acc[productInfo.id] = productInfo.quantity;
            return acc;
        }, {});

        // Mahsulotlarni yangilash uchun bulkWrite metodidan foydalanish
        const productUpdates = products.map(productInfo => ({
            updateOne: {
                filter: { _id: productInfo.id },
                update: { $inc: { quantity: -productInfo.quantity } },
                upsert: false, // Agar mahsulot topilmasa, yangilash amalga oshirilmaydi
            },
        }));

        const result = await Product.bulkWrite(productUpdates);
        if (result.modifiedCount !== products.length) {
            return res.status(400).json({ message: 'Zaxirada yetarli miqdor yo\'q yoki mahsulot topilmadi' });
        }

        // Sotuvni saqlash
        const newSale = new Sale({
            products: products.map(product => ({
                product: product.id,
                quantity: product.quantity,
                name: product.name, // Mahsulot nomi
                price: product.price, // Mahsulot narxi
                sellPrice: product.sellPrice,
                total: product.sellPrice * product.quantity, // Umumiy summa
            })),
            saleType,
            totalAmount, // Jami summasi
            buyerDetails,
            totalQuantity,
            quantities,
            date: new Date(),
        });
        await newSale.save();

        // Balansni yangilash
        let balance = await Balance.findOne();
        if (!balance) {
            // Agar balans topilmasa, yangi balans yaratamiz
            balance = new Balance({ cashBalance: 0, creditBalance: 0 });
        }

        // Balansni yangilash
        if (saleType === 'cash') {
            balance.cashBalance += totalAmount;
        } else {
            balance.creditBalance += totalAmount;
        }
        await balance.save();

        // Yangi sotuvni qaytarish
        res.status(201).json(newSale);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Update product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;



