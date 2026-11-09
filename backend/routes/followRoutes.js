
const express = require("express");
const router = express.Router();

const {
  followUser,
  unfollowUser,
} = require("../controllers/followController");

const authMiddleware = require("../middleware/authMiddleware");

// Follow a user
router.put("/:id/follow", authMiddleware, followUser);

// Unfollow a user
router.put("/:id/unfollow", authMiddleware, unfollowUser);

module.exports = router;
