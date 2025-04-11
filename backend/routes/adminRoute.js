const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");

router.post("/register", adminAuthController.register);
router.post("/login", adminAuthController.login);

module.exports = router;
