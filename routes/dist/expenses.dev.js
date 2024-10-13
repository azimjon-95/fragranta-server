"use strict";

var express = require('express');

var router = express.Router();

var Expense = require('../models/Expense');

var Balance = require('../models/Balance'); // Xarajat qo'shish va balansni yangilash


router.post('/', function _callee(req, res) {
  var _req$body, description, amount, balance, expenseAmount, newExpense;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, description = _req$body.description, amount = _req$body.amount;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Balance.findOne());

        case 4:
          balance = _context.sent;

          if (balance) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Balans topilmadi'
          }));

        case 7:
          // Xarajat miqdorini son ko'rinishiga keltirish
          expenseAmount = parseFloat(amount);

          if (!isNaN(expenseAmount)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Miqdori noto\'g\'ri formatda'
          }));

        case 10:
          // Xarajat qo'shish
          newExpense = new Expense({
            description: description,
            amount: expenseAmount
          });
          _context.next = 13;
          return regeneratorRuntime.awrap(newExpense.save());

        case 13:
          // Balansni yangilash
          balance.cashBalance -= expenseAmount; // Miqdorni ayirish

          _context.next = 16;
          return regeneratorRuntime.awrap(balance.save());

        case 16:
          res.status(201).json({
            message: 'Xarajat muvaffaqiyatli qo\'shildi va balans yangilandi',
            newExpense: newExpense,
            updatedBalance: balance.cashBalance
          });
          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            error: _context.t0.message
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 19]]);
}); // Get all expenses

router.get('/', function _callee2(req, res) {
  var expenses;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Expense.find());

        case 3:
          expenses = _context2.sent;
          res.status(200).json(expenses);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;