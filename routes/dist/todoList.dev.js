"use strict";

var express = require('express');

var todos = express.Router();

var mongoose = require('mongoose'); //--------------------------------------


var todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});
var Todo = mongoose.model('Todo', todoSchema); //--------------------------------------
// CRUD operatsiyalari
// Create

todos.post('/', function _callee(req, res) {
  var todo;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          todo = new Todo({
            text: req.body.text
          });
          _context.next = 3;
          return regeneratorRuntime.awrap(todo.save());

        case 3:
          res.status(201).json(todo);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Read

todos.get('/', function _callee2(req, res) {
  var todos;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Todo.find());

        case 2:
          todos = _context2.sent;
          res.json(todos);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Update

todos.put('/:id', function _callee3(req, res) {
  var id, todo;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Todo.findByIdAndUpdate(id, req.body, {
            "new": true
          }));

        case 3:
          todo = _context3.sent;
          res.json(todo);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Delete

todos["delete"]('/:id', function _callee4(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Todo.findByIdAndDelete(id));

        case 3:
          res.status(204).send();

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = todos;