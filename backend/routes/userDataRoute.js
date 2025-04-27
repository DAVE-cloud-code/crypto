const express = require('express');
const router = express.Router();
const userDataController = require('../controllers/userDataController');
const auth = require('../middlewares/authMiddleware'); // your middleware to verify JWT
const isAdmin = require('../middlewares/isAdmin')
const verifyToken = require('../middlewares/adminMiddleware');

router.post('/deposit', auth, userDataController.addDeposit);
// router.post('/withdraw', auth, userDataController.addWithdrawal);
router.post('/trade', auth, userDataController.addTrade);
router.get('/trades', auth, userDataController.getUserTrades);
router.get('/transactions', auth, userDataController.getAllTransactions);
router.post('/update-withdrawal-status', auth, userDataController.updateWithdrawalStatus);
router.get('/dashboard', auth, userDataController.getUserDashboard);
router.put('/update-balance', auth, userDataController.updateBalances);
router.put('/update-profile', auth, userDataController.updateUserProfile);
router.get('/wallets', auth, userDataController.getWallets);

router.post("/place-loan", auth, userDataController.placeLoan);
router.get("/get-loan", auth, userDataController.getUserLoans);

// Admin route
router.put("/approve/:userId/:loanId", verifyToken, isAdmin, userDataController.approveLoan);
router.post('/add-wallet', verifyToken, isAdmin, userDataController.addWallet);
router.get('/get-wallets', verifyToken, isAdmin, userDataController.getAllWalletsAdmin);
router.delete('/delete-wallet/:id', verifyToken, isAdmin, userDataController.deleteWallet);
router.put('/update-wallet/:id', verifyToken, isAdmin, userDataController.updateWallet);

module.exports = router;
