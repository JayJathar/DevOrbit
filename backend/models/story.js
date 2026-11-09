const mongoose = require("mongoose");

const LANGS = ["JavaScript", "TypeScript", "Python", "Go", "CSS", "HTML"];

const musicSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    title: { type: String, trim: true, default: "" },
    artist: { type: String, trim: true, default: "" },
    cover: { type: String, default: "" },
    previewUrl: { type: String, default: "" },
    musicUrl: { type: String, default: "" },
  },
  { _id: false },
);

const viewerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["text", "photo", "code"],
      default: "text",
    },

    mediaUrl: { type: String, default: "" },
    text: { type: String, default: "", maxlength: 160 },
    code: { type: String, default: "", maxlength: 400 },
    lang: { type: String, enum: LANGS, default: "JavaScript" },

    background: { type: String, default: "#000000" },
    music: { type: musicSchema, default: undefined },

    musicPos: {
      x: { type: Number, default: 7 },
      y: { type: Number, default: 68 },
    },

    musicStyle: {
      type: String,
      enum: ["full", "pill"],
      default: "full",
    },

    musicRot: { type: Number, default: 0 },
    musicScale: { type: Number, default: 1 },

    viewers: {
      type: [viewerSchema],
      default: [],
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
storySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Story", storySchema);
module.exports.LANGS = LANGS;
