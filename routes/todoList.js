const express = require('express');
const todos = express.Router();
const mongoose = require('mongoose');

//--------------------------------------
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);
//--------------------------------------

// CRUD operatsiyalari

// Create
todos.post('/', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
    });
    await todo.save();
    res.status(201).json(todo);
});

// Read
todos.get('/', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// Update
todos.put('/:id', async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    res.json(todo);
});

// Delete
todos.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.status(204).send();
});

module.exports = todos;
