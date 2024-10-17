"use strict";

var express = require('express');

var router = express.Router();

var Product = require('../models/Product'); // Create product


router.post('/', function _callee(req, res) {
  var newProduct;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          newProduct = new Product(req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(newProduct.save());

        case 4:
          res.status(201).json(newProduct);
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
}); // Get total quantity and product count

router.get('/total-quantity', function _callee2(req, res) {
  var result, productCount, totalQuantity;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Product.aggregate([{
            $group: {
              _id: null,
              totalQuantity: {
                $sum: "$quantity"
              }
            }
          }]));

        case 3:
          result = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Product.countDocuments());

        case 6:
          productCount = _context2.sent;
          // If result array is empty, return totalQuantity as 0
          totalQuantity = result.length > 0 ? result[0].totalQuantity : 0;
          res.status(200).json({
            totalQuantity: totalQuantity,
            productCount: productCount
          });
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/total-purchase-price', function _callee3(req, res) {
  var products, totalPurchasePrice;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Product.find());

        case 3:
          products = _context3.sent;
          // Har bir mahsulotning purchasePrice * quantity ni ko'paytirish va jamlash
          totalPurchasePrice = products.reduce(function (total, product) {
            var productTotal = product.purchasePrice * product.quantity; // purchasePrice * quantity

            return total + productTotal; // Natijani jamlash
          }, 0); // 0 boshlang'ich qiymat

          res.status(200).json({
            totalPurchasePrice: totalPurchasePrice
          }); // Umumiy natijani qaytarish

          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // Get all products

router.get('/', function _callee4(req, res) {
  var products;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Product.find());

        case 3:
          products = _context4.sent;
          res.status(200).json(products);
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
}); // Update product

router.put('/:id', function _callee5(req, res) {
  var updatedProduct;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          }));

        case 3:
          updatedProduct = _context5.sent;
          res.status(200).json(updatedProduct);
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: _context5.t0.message
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Delete product

router["delete"]('/:id', function _callee6(req, res) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Product.findByIdAndDelete(req.params.id));

        case 3:
          res.status(200).json({
            message: 'Product deleted'
          });
          _context6.next = 9;
          break;

        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            error: _context6.t0.message
          });

        case 9:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
module.exports = router;