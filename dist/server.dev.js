"use strict";

var express = require('express');

var mongoose = require('mongoose');

var cors = require('cors');

require('dotenv').config();

var app = express(); // Middleware

app.use(cors());
app.use(express.json());
app.get('/', function (req, res) {
  res.send('Hello Fragranta!');
}); // Routes

var productRoutes = require('./routes/products');

var saleRoutes = require('./routes/sales');

var balanceRoutes = require('./routes/balances');

var expenseRoutes = require('./routes/expenses');

app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/expenses', expenseRoutes); // MongoDB connection

mongoose.connect(process.env.MONGO_URI).then(function () {
  return app.listen(process.env.PORT || 5000, function () {
    return console.log('Server running...');
  });
})["catch"](function (err) {
  return console.log(err);
});