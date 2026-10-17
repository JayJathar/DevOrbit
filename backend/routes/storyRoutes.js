const express = require("express");
const router = express.Router();

const { getStories, createStory } = require("../controllers/storyController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Get active stories
router.get("/", getStories);

// Test route
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Story routes are working",
  });
});

// Create a story with optional image upload
router.post("/", authMiddleware, upload.single("image"), createStory);

module.exports = router;
