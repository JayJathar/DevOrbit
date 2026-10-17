const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:tozen", resetPassword);
router.get("/profile", authMiddleware, getProfile);
router.get("/me", authMiddleware, getProfile);
module.exports = router;
