const express = require("express");
const { createPost, getPosts } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();
// ==========================================
// CREATE POST
// ==========================================
router.post("/", authMiddleware, upload.single("image"), createPost);
// ==========================================
// GET ALL POSTS
// ==========================================
// Public route for now
// ==========================================

router.get("/", getPosts);

module.exports = router;
