const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  createStory,
  getStories,
  deleteStory,
} = require("../controllers/storyController");

router.get("/", protect, getStories);
router.post("/", protect, createStory);
router.delete("/:id", protect, deleteStory);

module.exports = router;
