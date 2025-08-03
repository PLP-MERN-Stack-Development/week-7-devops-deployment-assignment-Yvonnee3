const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      res.status(400).json({ success: false, message: 'Please add a title' });
      return;
    }
    const task = new Task({
      user: req.user._id,
      title,
      description,
    });
    const createdTask = await task.save();
    res.status(201).json({ success: true, data: createdTask });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ success: false, message: 'User not authorized to update this task' });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ success: false, message: 'User not authorized to delete this task' });
      return;
    }

    await Task.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Task removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
