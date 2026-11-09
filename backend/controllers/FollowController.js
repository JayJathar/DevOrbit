const mongoose = require("mongoose");
const User = require("../models/User");

const followUser = async (req, res) => {
  try {
    const currentUserId = req.user?.id || req.user?._id;
    const targetUserId = req.params.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (
      !mongoose.isValidObjectId(currentUserId) ||
      !mongoose.isValidObjectId(targetUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const currentId = new mongoose.Types.ObjectId(currentUserId);
    const targetId = new mongoose.Types.ObjectId(targetUserId);

    if (currentId.equals(targetId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentId),
      User.findById(targetId),
    ]);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    const following = currentUser.following || [];
    const alreadyFollowing = following.some(
      (id) => id.toString() === targetId.toString(),
    );

    if (alreadyFollowing) {
      return res.status(409).json({
        success: false,
        message: "You are already following this user",
      });
    }

    await Promise.all([
      User.updateOne(
        { _id: currentId },
        { $addToSet: { following: targetId } },
      ),
      User.updateOne(
        { _id: targetId },
        { $addToSet: { followers: currentId } },
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user?.id || req.user?._id;
    const targetUserId = req.params.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (
      !mongoose.isValidObjectId(currentUserId) ||
      !mongoose.isValidObjectId(targetUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const currentId = new mongoose.Types.ObjectId(currentUserId);
    const targetId = new mongoose.Types.ObjectId(targetUserId);

    if (currentId.equals(targetId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself",
      });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentId),
      User.findById(targetId),
    ]);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    await Promise.all([
      User.updateOne({ _id: currentId }, { $pull: { following: targetId } }),
      User.updateOne({ _id: targetId }, { $pull: { followers: currentId } }),
    ]);

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
};
