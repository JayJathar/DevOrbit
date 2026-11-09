const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  getSuggestedUsers,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:tozen", resetPassword);
router.get("/profile", authMiddleware, getProfile);
router.get("/me", authMiddleware, getProfile);
router.get("/suggested", authMiddleware, getSuggestedUsers);

module.exports = router;
