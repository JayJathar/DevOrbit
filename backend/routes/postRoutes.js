const express = require("express");

const {
  createPost,
  getPosts,
  toggleLike,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPost);

router.get("/", getPosts);

router.post("/:postId/like", authMiddleware, toggleLike);

module.exports = router;
