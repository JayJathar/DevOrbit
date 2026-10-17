const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    // User who created the post
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Post type
    type: {
      type: String,
      enum: ["text", "project", "code"],
      required: true,
    },

    // Used mainly for Project and Code posts
    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    // Main post content / description / code
    content: {
      type: String,
      trim: true,
      required: true,
    },

    // Hashtags
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],

    // Project-specific fields
    projectUrl: {
      type: String,
      trim: true,
      default: "",
    },

    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },
    codeLang: {
      type: String,
      enum: ["JavaScript", "TypeScript", "Python", "Rust", "Go", "CSS", ""],
      default: "",
    },

    // Media
    image: {
      type: String,
      default: "",
    },

    video: {
      type: String,
      default: "",
    },

    // Engagement
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Post", postSchema);
