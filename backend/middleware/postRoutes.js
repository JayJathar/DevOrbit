const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createPost,
  getPosts,
  getFollowingPosts,
  getSuggestedPosts,
  toggleLike,
} = require("../controllers/postController");

router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost,
);

router.get("/", protect, getPosts);
router.get("/following", protect, getFollowingPosts);
router.get("/suggested", protect, getSuggestedPosts);
router.put("/:postId/like", protect, toggleLike);

module.exports = router;
