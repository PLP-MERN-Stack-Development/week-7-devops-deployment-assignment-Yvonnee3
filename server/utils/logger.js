const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level, message, meta = {}) => {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    ...meta,
    pid: process.pid,
  });
};

const writeToFile = (filename, message) => {
  const filePath = path.join(logsDir, filename);
  fs.appendFileSync(filePath, message + '\n');
};

const logger = {
  info: (message, meta = {}) => {
    const logMessage = formatMessage('info', message, meta);
    console.log(logMessage);
    
    if (process.env.NODE_ENV === 'production') {
      writeToFile('app.log', logMessage);
    }
  },

  warn: (message, meta = {}) => {
    const logMessage = formatMessage('warn', message, meta);
    console.warn(logMessage);
    
    if (process.env.NODE_ENV === 'production') {
      writeToFile('app.log', logMessage);
    }
  },

  error: (message, meta = {}) => {
    const logMessage = formatMessage('error', message, meta);
    console.error(logMessage);
    
    if (process.env.NODE_ENV === 'production') {
      writeToFile('error.log', logMessage);
    }
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      const logMessage = formatMessage('debug', message, meta);
      console.debug(logMessage);
    }
  },
};

module.exports = logger;