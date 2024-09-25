const express = require("express");
const router = express.Router();
const { login } = require("../controllers/user_controller");

// Secure Routes
router.route("/login").post(login);

module.exports = router;