const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerRules, loginRules, handleValidationErrors } = require("../middleware/validate");

// Auth routes with rate limiting and input validation
router.post("/register", authLimiter, registerRules, handleValidationErrors, registerUser);
router.post("/login", authLimiter, loginRules, handleValidationErrors, loginUser);
router.get("/me", protect, getUserProfile);

module.exports = router;
