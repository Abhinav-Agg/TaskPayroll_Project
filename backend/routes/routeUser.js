const express = require("express");
const router = express.Router();
const { login, createAdmin, regenerateAccessTokenRefresh, currentUserDetails } = require("../controllers/user_controller");

// Secure Routes
router.route("/").get(currentUserDetails);
router.route("/login").post(login);
//router.route("/refresh-token").post(regenerateAccessTokenRefresh);  // refresh token

// Admin API
router.route("/createAdmin").post(createAdmin);  // Admin Create only with this API.

module.exports = router;