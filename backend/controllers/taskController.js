const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const logger = require('../utils/logger');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json({ success: true, data: tasks });
  logger.info(`User ${req.user.id} fetched tasks.`);
});

// @desc    Set task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error('Please add a title field');
  }
  const task = await Task.create({
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
  });
  res.status(201).json({ success: true, data: task });
  logger.info(`User ${req.user.id} created task: "${task.title}"`);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }
  // Make sure the logged in user matches the task user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, data: updatedTask });
  logger.info(`User ${req.user.id} updated task: "${task.title}"`);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }
  // Make sure the logged in user matches the task user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await Task.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, message: 'Task removed' });
  logger.info(`User ${req.user.id} deleted task: "${task.title}"`);
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
