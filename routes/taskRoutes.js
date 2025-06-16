const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get('/', async (req, res) => {
    const {id,role} = req.user;
    try {
        let tasks;
        if (role === 'user') {
            tasks = await Task.find({ createdBy: id });
        } else {
            tasks = await Task.find().populate('assignedTo', 'username').populate('createdBy', 'username');
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { role } = req.user;

    try {
        let task;
        if (role === 'user') {
            task = await Task.findById(id).populate('assignedTo', 'username').populate('createdBy', 'username').where({ createdBy: req.user.id });
        } else {
        task = await Task.findById(id).populate('assignedTo', 'username').populate('createdBy', 'username');
        }
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
});

router.post('/', async (req, res) => {
    const { title, description, status, assignedTo } = req.body;
    const createdBy = req.user.id; 
    try {
        const newTask = new Task({ title, description, status, assignedTo, createdBy });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, status, assignedTo },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'username').populate('createdBy', 'username');
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

module.exports = router;