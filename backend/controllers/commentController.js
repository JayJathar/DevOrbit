const Comment = require("../models/Comment");
const Post = require("../models/Post");

// ADD COMMENT / REPLY
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, parentComment } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (parentComment) {
      const parent = await Comment.findOne({
        _id: parentComment,
        post: postId,
        parentComment: null,
      });

      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user.id || req.user._id,
      text: text.trim(),
      parentComment: parentComment || null,
    });

    await comment.populate("author", "fullname username");

    return res.status(201).json({
      success: true,
      message: parentComment
        ? "Reply added successfully"
        : "Comment added successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

// GET COMMENTS
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comments = await Comment.find({
      post: postId,
      parentComment: null,
    })
      .populate("author", "fullname username")
      .sort({ createdAt: -1 })
      .lean();

    const commentIds = comments.map((comment) => comment._id);

    const replies = await Comment.find({
      post: postId,
      parentComment: { $in: commentIds },
    })
      .populate("author", "fullname username")
      .sort({ createdAt: 1 })
      .lean();

    const commentsWithReplies = comments.map((comment) => ({
      ...comment,
      replies: replies.filter(
        (reply) => reply.parentComment.toString() === comment._id.toString(),
      ),
    }));

    return res.status(200).json({
      success: true,
      totalComments: comments.length,
      comments: commentsWithReplies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

// DELETE COMMENT / REPLY
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const currentUserId = req.user.id || req.user._id;

    if (comment.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this comment",
      });
    }

    if (!comment.parentComment) {
      await Comment.deleteMany({
        parentComment: commentId,
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
