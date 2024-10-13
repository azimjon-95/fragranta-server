const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const balanceRoutes = require('./routes/balances');
const expenseRoutes = require('./routes/expenses');

app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/expenses', expenseRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(process.env.PORT || 5000, () => console.log('Server running...')))
    .catch((err) => console.log(err));
