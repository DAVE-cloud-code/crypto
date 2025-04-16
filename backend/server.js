const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoute");
const userDataRoutes = require('./routes/userDataRoute');
const cors = require('cors');
const winston = require('winston');
const path = require('path');
dotenv.config();


// Set up logging with Winston
const winstonDailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winstonDailyRotateFile({
      filename: 'logs/%DATE%-server.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',  // keep logs for the last 14 days
      format: winston.format.simple()
    })
  ]
});


const app = express();

app.use(cors('*'));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/user', userDataRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Optional: fallback for SPA routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});


const MONGO = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose.connect(MONGO)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(process.env.PORT, () => {
      logger.info(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    logger.error('MongoDB connection failed:', err);
  });
