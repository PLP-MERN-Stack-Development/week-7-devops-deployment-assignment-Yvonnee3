const express = require('express');
const router = express.Router();

// @route   GET /api/health
// @desc    Simple health check
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;