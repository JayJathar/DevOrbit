const Post = require("../models/Post");
const User = require("../models/User");

const AUTHOR_FIELDS = "fullname username";

// CREATE POST
const createPost = async (req, res) => {
  try {
    const { type, title, content, tags, projectUrl, githubUrl, codeLang } =
      req.body || {};

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Post type is required",
      });
    }

    const allowedTypes = ["text", "project", "code"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post type",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    let parsedTags = [];

    if (tags) {
      try {
        parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch (error) {
        parsedTags = [];
      }
    }

    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];

    const imagePath = imageFile ? `/uploads/${imageFile.filename}` : "";
    const videoPath = videoFile ? `/uploads/${videoFile.filename}` : "";

    const post = await Post.create({
      author: req.user.id,
      type,
      title: title ? title.trim() : "",
      content: content.trim(),
      tags: parsedTags,
      projectUrl: projectUrl ? projectUrl.trim() : "",
      githubUrl: githubUrl ? githubUrl.trim() : "",
      codeLang: codeLang || "",
      image: imagePath,
      video: videoPath,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      AUTHOR_FIELDS,
    );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// GET ALL POSTS
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", AUTHOR_FIELDS)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

// GET POST LIKES
const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("likes", AUTHOR_FIELDS);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: post.likes.length,
      users: post.likes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch likes",
      error: error.message,
    });
  }
};

// GET FOLLOWING POSTS
const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentUser = await User.findById(userId).select("following");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const authorIds = [...(currentUser.following || []), userId];

    const posts = await Post.find({ author: { $in: authorIds } })
      .populate("author", AUTHOR_FIELDS)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch following posts",
    });
  }
};

// GET SUGGESTED POSTS
const getSuggestedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentUser = await User.findById(userId).select("following");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const followingIds = (currentUser.following || []).map((id) =>
      id.toString(),
    );

    const excludedUserIds = [userId.toString(), ...followingIds];

    const posts = await Post.find({ author: { $nin: excludedUserIds } })
      .populate("author", AUTHOR_FIELDS)
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suggested posts",
    });
  }
};

// TOGGLE LIKE
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update like",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getFollowingPosts,
  getSuggestedPosts,
  toggleLike,
  getPostLikes,
};
