const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    purchasePrice: Number,
    sellingPrice: Number,
    quantity: Number,
});

module.exports = mongoose.model('Product', productSchema);
