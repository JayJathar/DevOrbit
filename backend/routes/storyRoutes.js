const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createStory,
  getStories,
  deleteStory,
  recordStoryView,
  getStoryViewers,
} = require("../controllers/storyController");

router.get("/", protect, getStories);
router.post("/:id/view", protect, recordStoryView);
router.get("/:id/viewers", protect, getStoryViewers);
router.post("/", protect, createStory);
router.delete("/:id", protect, deleteStory);
module.exports = router;
