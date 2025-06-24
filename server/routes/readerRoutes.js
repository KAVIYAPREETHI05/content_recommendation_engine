// routes/readerRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Like = require("../models/Like");
const Comment = require("../models/Comment");


// Get reader by ID
router.get("/:readerID", async (req, res) => {
  const { readerID } = req.params;
  try {
    const reader = await User.findOne({ id: readerID, role: "reader" }).select("-password");
    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }
    res.json(reader);
  } catch (error) {
    console.error("Error fetching reader:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/analytics/:readerId', async (req, res) => {
  try {
    const { readerId } = req.params;

    // All liked posts by this reader
    const likes = await Like.find({ userId: readerId });
    const likedPostIds = likes.map(like => like.postId.toString());

    // All commented posts by this reader
    const comments = await Comment.find({ userId: readerId });
    const commentedPostIds = comments.map(comment => comment.postId.toString());

    // Total unique blogs this reader interacted with
    const uniquePostIds = new Set([...likedPostIds, ...commentedPostIds]);

    res.json({
      totalBlogsRead: uniquePostIds.size,
      likedBlogs: likedPostIds.length,
      commentedBlogs: commentedPostIds.length,
    });
  } catch (err) {
    console.error("Error fetching reader analytics:", err);
    res.status(500).json({ message: "Failed to fetch reader analytics" });
  }
});






module.exports = router;
