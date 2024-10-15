"use strict";

var express = require('express');

var router = express.Router();

var Sale = require('../models/Sale');

var Product = require('../models/Product');

var Balance = require('../models/Balance'); // Get all sales


router.get('/', function _callee(req, res) {
  var sales;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Sale.find());

        case 3:
          sales = _context.sent;
          res.status(200).json(sales);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Get all sales with profit calculation for 'cash' sale types

router.get('/totalProfit', function _callee2(req, res) {
  var result, response;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Sale.aggregate([{
            // Faqat 'cash' turidagi sotuvlarni tanlash
            $match: {
              saleType: 'cash'
            }
          }, {
            // Mahsulotlar va foyda hisoblash
            $unwind: '$products' // Har bir sotuv uchun mahsulotlarni ajratish

          }, {
            // Foyda hisoblash va yangilanish
            $project: {
              totalProfit: {
                $multiply: [{
                  $subtract: ['$products.sellPrice', '$products.price']
                }, '$products.quantity']
              },
              saleType: 1,
              totalAmount: 1,
              totalQuantity: 1,
              date: 1,
              products: 1
            }
          }, {
            // Sotuvlar bo'yicha umumiy foyda
            $group: {
              _id: '$_id',
              // Sotuv ID
              saleType: {
                $first: '$saleType'
              },
              totalAmount: {
                $first: '$totalAmount'
              },
              totalQuantity: {
                $first: '$totalQuantity'
              },
              date: {
                $first: '$date'
              },
              products: {
                $push: '$products'
              },
              totalProfit: {
                $sum: '$totalProfit'
              } // Umumiy sof foyda

            }
          }, {
            // Umumiy foydani hisoblash
            $group: {
              _id: null,
              // Umumiy hisob
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
              overallProfit: {
                $sum: '$totalProfit'
              } // Umumiy foyda

            }
          }]));

        case 3:
          result = _context2.sent;
          // Return the result with overallProfit
          response = result.length > 0 ? {
            sales: result[0].sales,
            overallProfit: result[0].overallProfit
          } : {
            sales: [],
            overallProfit: 0
          };
          res.status(200).json(response.overallProfit);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // Create a sale (cash or credit)
// Sotuvni yaratish (naqd yoki kredit)

router.post('/', function _callee3(req, res) {
  var _req$body, products, saleType, buyerDetails, totalAmount, totalQuantity, quantities, productUpdates, result, newSale, balance;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, products = _req$body.products, saleType = _req$body.saleType, buyerDetails = _req$body.buyerDetails;
          _context3.prev = 1;
          // Umumiy summani hisoblash
          totalAmount = products.reduce(function (acc, productInfo) {
            return acc + productInfo.sellPrice * productInfo.quantity;
          }, 0);
          totalQuantity = products.reduce(function (acc, productInfo) {
            return acc + productInfo.quantity;
          }, 0);
          quantities = products.reduce(function (acc, productInfo) {
            acc[productInfo.id] = productInfo.quantity;
            return acc;
          }, {}); // Mahsulotlarni yangilash uchun bulkWrite metodidan foydalanish

          productUpdates = products.map(function (productInfo) {
            return {
              updateOne: {
                filter: {
                  _id: productInfo.id
                },
                update: {
                  $inc: {
                    quantity: -productInfo.quantity
                  }
                },
                upsert: false // Agar mahsulot topilmasa, yangilash amalga oshirilmaydi

              }
            };
          });
          _context3.next = 8;
          return regeneratorRuntime.awrap(Product.bulkWrite(productUpdates));

        case 8:
          result = _context3.sent;

          if (!(result.modifiedCount !== products.length)) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Zaxirada yetarli miqdor yo\'q yoki mahsulot topilmadi'
          }));

        case 11:
          // Sotuvni saqlash
          newSale = new Sale({
            products: products.map(function (product) {
              return {
                product: product.id,
                quantity: product.quantity,
                name: product.name,
                // Mahsulot nomi
                price: product.price,
                // Mahsulot narxi
                sellPrice: product.sellPrice,
                total: product.sellPrice * product.quantity // Umumiy summa

              };
            }),
            saleType: saleType,
            totalAmount: totalAmount,
            // Jami summasi
            buyerDetails: buyerDetails,
            totalQuantity: totalQuantity,
            quantities: quantities,
            date: new Date()
          });
          _context3.next = 14;
          return regeneratorRuntime.awrap(newSale.save());

        case 14:
          _context3.next = 16;
          return regeneratorRuntime.awrap(Balance.findOne());

        case 16:
          balance = _context3.sent;

          if (!balance) {
            // Agar balans topilmasa, yangi balans yaratamiz
            balance = new Balance({
              cashBalance: 0,
              creditBalance: 0
            });
          } // Balansni yangilash


          if (saleType === 'cash') {
            balance.cashBalance += totalAmount;
          } else {
            balance.creditBalance += totalAmount;
          }

          _context3.next = 21;
          return regeneratorRuntime.awrap(balance.save());

        case 21:
          // Yangi sotuvni qaytarish
          res.status(201).json(newSale);
          _context3.next = 27;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 24]]);
}); // Update product

router.put('/:id', function _callee4(req, res) {
  var updatedProduct;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Sale.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          }));

        case 3:
          updatedProduct = _context4.sent;
          res.status(200).json(updatedProduct);
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;