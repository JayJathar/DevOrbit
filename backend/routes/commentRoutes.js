const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

// Get comments for a post
router.get("/:postId/comments", getComments);

// Add comment to a post
router.post("/:postId/comments", authMiddleware, addComment);

// Delete a comment
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
