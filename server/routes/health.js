const express = require('express');
const mongoose = require('mongoose');
const packageJson = require('../package.json');

const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
    version: packageJson.version || '1.0.0',
    memory: process.memoryUsage(),
    pid: process.pid,
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    healthcheck.database = {
      status: dbStatus[dbState],
      connected: dbState === 1,
    };

    // If database is connected, test with a simple query
    if (dbState === 1) {
      await mongoose.connection.db.admin().ping();
      healthcheck.database.ping = 'OK';
    }

    res.status(200).json({
      success: true,
      data: healthcheck,
    });
  } catch (error) {
    healthcheck.database = {
      status: 'error',
      connected: false,
      error: error.message,
    };

    res.status(503).json({
      success: false,
      message: 'Service Unavailable',
      data: healthcheck,
    });
  }
});

// @route   GET /api/health/ready
// @desc    Readiness check endpoint
// @access  Public
router.get('/ready', async (req, res) => {
  try {
    // Check if all critical services are ready
    const dbConnected = mongoose.connection.readyState === 1;
    
    if (!dbConnected) {
      return res.status(503).json({
        success: false,
        message: 'Service not ready',
        checks: {
          database: false,
        },
      });
    }

    // Test database with a simple query
    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      success: true,
      message: 'Service ready',
      checks: {
        database: true,
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service not ready',
      error: error.message,
    });
  }
});

// @route   GET /api/health/live
// @desc    Liveness check endpoint
// @access  Public  
router.get('/live', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is alive',
    timestamp: Date.now(),
  });
});

module.exports = router;