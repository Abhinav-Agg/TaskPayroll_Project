const express = require("express");
const router = express.Router();
const { login, createAdmin, reGenerateAccessTokenRefresh, currentUserDetails } = require("../controllers/user_controller");

// Secure Routes
router.route("/").get(currentUserDetails);
router.route("/login").post(login);
router.route("/refresh-token").post(reGenerateAccessTokenRefresh);  // refresh token

// Admin API
router.route("/createAdmin").post(createAdmin);  // Admin Create only with this API.

module.exports = router;