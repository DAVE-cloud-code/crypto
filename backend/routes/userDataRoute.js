const express = require('express');
const router = express.Router();
const userDataController = require('../controllers/userDataController');
const auth = require('../middlewares/authMiddleware'); // your middleware to verify JWT
const isAdmin = require('../middlewares/isAdmin')

router.post('/deposit', auth, userDataController.addDeposit);
router.post('/withdraw', auth, userDataController.addWithdrawal);
router.post('/trade', auth, userDataController.addTrade);
router.get('/trades', auth, userDataController.getUserTrades);
router.get('/transactions', auth, userDataController.getAllTransactions);
router.post('/update-withdrawal-status', auth, userDataController.updateWithdrawalStatus);
router.get('/dashboard', auth, userDataController.getUserDashboard);

router.post("/place-loan", auth, userDataController.placeLoan);
router.get("/get-loan", auth, userDataController.getUserLoans);

// Admin route
router.put("/approve/:userId/:loanId", auth, isAdmin, userDataController.approveLoan);

module.exports = router;
