const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    cashBalance: { type: Number, default: 0 },
    creditBalance: { type: Number, default: 0 },
});

module.exports = mongoose.model('Balance', balanceSchema);
