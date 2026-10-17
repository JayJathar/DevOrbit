const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE POST REQUEST");
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    console.log("REQ USER:", req.user);
    console.log("=================================");

    const {
      type,
      title,
      content,
      tags,
      projectUrl,
      githubUrl,
      codeLang,
      video,
    } = req.body || {};

    // ==========================================
    // CHECK USER
    // ==========================================

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    // ==========================================
    // CHECK POST TYPE
    // ==========================================

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

    // ==========================================
    // CHECK CONTENT
    // ==========================================

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    // ==========================================
    // PARSE TAGS
    // ==========================================

    let parsedTags = [];

    if (tags) {
      try {
        parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch (error) {
        parsedTags = [];
      }
    }

    // ==========================================
    // IMAGE PATH
    // ==========================================

    let imagePath = "";

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    console.log("IMAGE PATH:", imagePath);

    // ==========================================
    // CREATE POST
    // ==========================================

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

      video: video || "",
    });

    // ==========================================
    // POPULATE AUTHOR
    // ==========================================

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "fullname username",
    );

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("=================================");
    console.error("CREATE POST ERROR:");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    console.log("=================================");
    console.log("GET POSTS REQUEST");
    console.log("=================================");

    const posts = await Post.find()
      .populate("author", "fullname username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("=================================");
    console.error("GET POSTS ERROR:");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.user.id;

    console.log("=================================");
    console.log("TOGGLE LIKE REQUEST");
    console.log("POST ID:", postId);
    console.log("USER ID:", userId);
    console.log("=================================");

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

    console.log("LIKED:", !alreadyLiked);
    console.log("TOTAL LIKES:", post.likes.length);

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("=================================");
    console.error("TOGGLE LIKE ERROR:");
    console.error(error);
    console.error("=================================");

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
  toggleLike,
};
