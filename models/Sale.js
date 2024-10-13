const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    saleType: { type: String, enum: ['cash', 'credit'] }, // Sale type
    buyerDetails: {
        fullName: { type: String }, // Foydalanuvchi to'liq ismi
        phone: { type: String }, // Telefon raqami
    },
    totalAmount: { type: Number }, // Jami summasi
    totalQuantity: { type: Number }, // Jami miqdori
    quantities: { type: Map, of: Number }, // Mahsulotlar miqdorlari
    products: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Mahsulot IDsi
        name: { type: String }, // Mahsulot nomi
        price: { type: Number }, // Mahsulot narxi
        quantity: { type: Number }, // Mahsulot miqdori
        total: { type: Number }, // Umumiy summa
    }],
    date: { type: Date, default: Date.now }, // Sotuv sanasi
});

module.exports = mongoose.model('Sale', saleSchema);
