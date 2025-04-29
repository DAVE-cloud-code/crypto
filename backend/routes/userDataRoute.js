const express = require('express');
const router = express.Router();
const userDataController = require('../controllers/userDataController');
const auth = require('../middlewares/authMiddleware'); // your middleware to verify JWT
const isAdmin = require('../middlewares/isAdmin')
const verifyToken = require('../middlewares/adminMiddleware');

router.post('/deposit', auth, userDataController.addDeposit);
router.post('/withdraw', auth, userDataController.addWithdrawal);
router.post('/trade', auth, userDataController.addTrade);
router.get('/trades', auth, userDataController.getUserTrades);
router.post('/update-withdrawal-status', auth, userDataController.updateWithdrawalStatus);
router.get('/dashboard', auth, userDataController.getUserDashboard);
router.put('/update-balance', auth, userDataController.updateBalances);
router.put('/update-profile', auth, userDataController.updateUserProfile);
router.get('/wallets', auth, userDataController.getWallets);
router.post('/claim-bonus', auth, userDataController.claimBonus);
router.get('/get-bonus', auth, userDataController.checkBonus);
// Loan routes
router.post("/place-loan", auth, userDataController.placeLoan);
router.get("/get-loan", auth, userDataController.getUserLoans);

// Admin route\
router.post('/add-bonus',verifyToken, isAdmin, userDataController.assignBonus);
router.get("/get-bonuses", verifyToken, isAdmin, userDataController.getAllAssignedBonuses);
router.put("/approve/:userId/:loanId", verifyToken, isAdmin, userDataController.approveLoan);
router.post('/add-wallet', verifyToken, isAdmin, userDataController.addWallet);
router.get('/get-wallets', verifyToken, isAdmin, userDataController.getAllWalletsAdmin);
router.delete('/delete-wallet/:id', verifyToken, isAdmin, userDataController.deleteWallet);
router.put('/update-wallet/:id', verifyToken, isAdmin, userDataController.updateWallet);
router.get('/transactions', verifyToken, isAdmin, userDataController.getAllTransactions);
router.patch('/update-transaction/:userId/:transactionId', verifyToken, isAdmin, userDataController.updateTransactionStatus);


module.exports = router;
