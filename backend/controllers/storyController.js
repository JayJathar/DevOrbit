const mongoose = require("mongoose");
const Story = require("../models/Story");
const { LANGS } = require("../models/Story");
const User = require("../models/User");

const clamp = (v, min, max, fallback) => {
  const n = Number(v);

  if (!Number.isFinite(n)) return fallback;

  return Math.min(Math.max(n, min), max);
};

const getUserId = (req) => req.user?._id || req.user?.id;

const parseMusic = (music) => {
  if (!music) return null;

  if (typeof music === "string") {
    try {
      music = JSON.parse(music);
    } catch (error) {
      return null;
    }
  }

  if (typeof music !== "object" || Array.isArray(music)) {
    return null;
  }

  if (!music.id) return null;

  return {
    id: String(music.id),
    title: String(music.title || ""),
    artist: String(music.artist || ""),
    cover: String(music.cover || ""),
    previewUrl: String(music.previewUrl || ""),
    musicUrl: String(music.musicUrl || ""),
  };
};

// CREATE STORY
exports.createStory = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const {
      type: rawType = "text",
      text = "",
      code = "",
      lang,
      background,
      mediaUrl = "",
      music,
      musicPos,
      musicStyle,
      musicRot,
      musicScale,
    } = req.body;

    const type = rawType === "image" ? "photo" : rawType;

    const uploadedMediaUrl = req.file
      ? `/uploads/${req.file.filename}`
      : mediaUrl;

    if (!["text", "photo", "code"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story type.",
      });
    }

    if (type === "text" && !String(text).trim()) {
      return res.status(400).json({
        success: false,
        message: "Story text is required.",
      });
    }

    if (type === "code" && !String(code).trim()) {
      return res.status(400).json({
        success: false,
        message: "Code is required.",
      });
    }

    if (type === "photo" && !uploadedMediaUrl) {
      return res.status(400).json({
        success: false,
        message: "Photo URL is required.",
      });
    }

    const data = {
      user: userId,
      type,
      text: String(text).trim().slice(0, 160),
      code: String(code).slice(0, 400),
      mediaUrl: uploadedMediaUrl,
      lang: LANGS.includes(lang) ? lang : "JavaScript",

      background: /^#[0-9a-fA-F]{6}$/.test(background || "")
        ? background
        : "#000000",

      musicStyle: musicStyle === "pill" ? "pill" : "full",
      musicRot: clamp(musicRot, -180, 180, 0),
      musicScale: clamp(musicScale, 0.5, 2.5, 1),

      musicPos: {
        x: clamp(musicPos?.x, -50, 150, 7),
        y: clamp(musicPos?.y, -50, 150, 68),
      },
    };

    const parsedMusic = parseMusic(music);

    if (parsedMusic) {
      data.music = parsedMusic;
    }

    const story = await Story.create(data);

    return res.status(201).json({
      success: true,
      message: "Story saved successfully",
      story,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while saving story.",
    });
  }
};

// GET ACTIVE STORIES
exports.getStories = async (req, res) => {
  try {
    const userId = String(getUserId(req) || "");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const currentUser = await User.findById(userId).select("following").lean();

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const followingIds = (currentUser.following || []).map((id) => String(id));

    const visibleUserIds = [...new Set([...followingIds, userId])];

    const stories = await Story.find({
      user: { $in: visibleUserIds },
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: 1 })
      .populate("user", "name fullname username")
      .lean();

    const result = stories
      .filter((story) => story.user)
      .map((story) => {
        const viewers = story.viewers || [];

        return {
          ...story,
          isMine: String(story.user._id) === userId,
          viewCount: viewers.length,
          hasViewed: viewers.some((viewer) => String(viewer.user) === userId),
          viewers: undefined,
        };
      });

    return res.status(200).json({
      success: true,
      stories: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not load stories.",
    });
  }
};

// RECORD A STORY VIEW
exports.recordStoryView = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID.",
      });
    }

    const story = await Story.findOne({
      _id: id,
      expiresAt: { $gt: new Date() },
    }).select("_id user viewers");

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Active story not found.",
      });
    }

    if (String(story.user) === String(userId)) {
      return res.status(200).json({
        success: true,
        counted: false,
        message: "Your own story does not count as a view.",
        viewCount: story.viewers.length,
      });
    }

    const update = await Story.updateOne(
      {
        _id: id,
        expiresAt: { $gt: new Date() },
        user: { $ne: userId },
        "viewers.user": { $ne: userId },
      },
      {
        $push: {
          viewers: {
            user: userId,
            viewedAt: new Date(),
          },
        },
      },
    );

    const updatedStory = await Story.findById(id).select("viewers");

    return res.status(200).json({
      success: true,
      counted: update.modifiedCount === 1,
      alreadyViewed: update.modifiedCount === 0,
      viewCount: updatedStory?.viewers.length || 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not record story view.",
    });
  }
};

// GET VIEWERS — STORY OWNER ONLY
exports.getStoryViewers = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID.",
      });
    }

    const story = await Story.findOne({
      _id: id,
      expiresAt: { $gt: new Date() },
    })
      .populate({
        path: "viewers.user",
        select: "name username fullname avatar profilePicture profileImage",
      })
      .lean();

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Active story not found.",
      });
    }

    if (String(story.user) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the story owner can view the viewer list.",
      });
    }

    const viewers = (story.viewers || [])
      .filter((entry) => entry.user)
      .map((entry) => ({
        _id: entry.user._id,
        name:
          entry.user.fullname ||
          entry.user.name ||
          entry.user.username ||
          "Developer",
        username: entry.user.username || "",
        avatar:
          entry.user.avatar ||
          entry.user.profilePicture ||
          entry.user.profileImage ||
          "",
        viewedAt: entry.viewedAt,
      }));

    return res.status(200).json({
      success: true,
      storyId: story._id,
      viewCount: viewers.length,
      viewers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not load story viewers.",
    });
  }
};

// DELETE STORY
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found.",
      });
    }

    if (String(story.user) !== String(getUserId(req))) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own story.",
      });
    }

    await story.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Story deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not delete story.",
    });
  }
};
