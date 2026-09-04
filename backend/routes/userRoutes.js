// Import Express
const express = require("express");
// Create Router
const router = express.Router();
// Import Controllers
const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", authMiddleware, getProfile);

// Export Router
module.exports = router;
