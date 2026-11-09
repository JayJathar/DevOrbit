const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createPost,
  getPosts,
  getFollowingPosts,
  getSuggestedPosts,
  toggleLike,
  getPostLikes,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost,
);

router.get("/", getPosts);
router.get("/following", authMiddleware, getFollowingPosts);
router.get("/suggested", authMiddleware, getSuggestedPosts);
router.post("/:postId/like", authMiddleware, toggleLike);
router.get("/:postId/likes", authMiddleware, getPostLikes); // NEW

module.exports = router;
