const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');

require("./controllers/tradeScheduler"); // Import the trade scheduler
// Route imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoute');
const userDataRoutes = require('./routes/userDataRoute');

dotenv.config();

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://oreantrade.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// ✅ Logger setup
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winstonDailyRotateFile({
      filename: 'logs/%DATE%-server.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      format: winston.format.simple()
    })
  ]
});

// ✅ Log all incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userDataRoutes);

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ✅ SPA fallback (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// ✅ Connect to MongoDB
const MONGO = process.env.MONGODB_URI;
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

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
  });
  
