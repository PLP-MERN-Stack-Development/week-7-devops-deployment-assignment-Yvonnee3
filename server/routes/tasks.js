const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', [
  query('status').optional().isIn(['pending', 'in-progress', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { status, priority, page = 1, limit = 10, search } = req.query;
    
    // Build query
    const query = { user: req.user.userId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: tasks,
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const taskData = {
      ...req.body,
      user: req.user.userId,
    };

    const task = new Task(taskData);
    await task.save();

    logger.info(`Task created: ${task._id} by user: ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    logger.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    logger.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601(),
  body('tags').optional().isArray(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    logger.info(`Task updated: ${task._id} by user: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    logger.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    logger.info(`Task deleted: ${task._id} by user: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    logger.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/tasks/stats/overview
// @desc    Get task statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Task.countDocuments({ user: userId });
    const overdue = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' },
    });

    res.json({
      success: true,
      data: {
        total,
        overdue,
        byStatus: stats,
        byPriority: priorityStats,
      },
    });
  } catch (error) {
    logger.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;