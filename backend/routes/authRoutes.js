const express = require('express');
const router = express.Router();
const { register, login, forgotPassword,resetPassword,getAllUsers } = require('../controllers/authControllers');
const verifyToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/roleMiddleware');

// Auth routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/register', register);
router.post('/login', login);

// Admin-only route
router.get('/users', verifyToken, isAdmin, getAllUsers);

module.exports = router;
