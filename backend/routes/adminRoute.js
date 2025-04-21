const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");
const auth = require('../middlewares/authMiddleware')
const isAdmin = require('../middlewares/isAdmin')
const userDataController = require('../controllers/userDataController')
const adminUserController = require('../controllers/adminUserController')


router.post("/register", adminAuthController.register);
router.post("/login", adminAuthController.login);
router.put("/approve/:userId/:loanId", auth, isAdmin, userDataController.approveLoan );
router.post("/send-bonus/:userId", auth, isAdmin, adminUserController.sendBonus);


module.exports = router;
