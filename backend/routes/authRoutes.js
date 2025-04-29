const express = require('express');
const router = express.Router();
const { register, login, forgotPassword,resetPassword,getAllUsers,logout, deleteUser,updatePassword } = require('../controllers/authControllers');
const verifyToken = require('../middlewares/adminMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const auth = require('../middlewares/authMiddleware');


// Auth routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/delete-user/:userId', verifyToken, isAdmin, deleteUser)
router.put('/update-password', auth, updatePassword );

// Admin-only route
router.get('/get-users', verifyToken, isAdmin, getAllUsers);

module.exports = router;
