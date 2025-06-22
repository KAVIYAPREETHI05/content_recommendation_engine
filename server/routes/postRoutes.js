// routes/postRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");
const Like = require('../models/Like');
const Comment = require('../models/Comment');

const router = express.Router();

// Setup multer storage (save uploads in /uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique filename
  },
});

const upload = multer({ storage });

// POST /api/posts with media file
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const {
      title,
      author,
      publishedDate,
      category,
      tags,
      content,
      creatorId,
    } = req.body;

    if (!title || !creatorId) {
      return res.status(400).json({ message: "Title and creatorId are required." });
    }

    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newPost = new Post({
      title,
      author,
      publishedDate,
      category,
      tags: tags.split(",").map((tag) => tag.trim()),
      content,
      mediaUrl,
      creatorId,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Post creation failed:", err);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
});
//get all post
router.get('/explore', async (req, res) => {
  try {
    const posts = await Post.find({ publishedDate: { $ne: null } }).sort({ publishedDate: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts in /explore:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

// Get posts by creatorId
router.get("/creator/:creatorId", async (req, res) => {
  try {
    const posts = await Post.find({ creatorId: req.params.creatorId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts", error: err.message });
  }
});

// Get a single post by postId
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
});

// Get liked and commented posts for a user
router.get('/user-actions/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Assuming you have models for likes and comments
    const liked = await Like.find({ userId }).select('postId');
    const commented = await Comment.find({ userId }).select('postId');

    res.json({
      likedPosts: liked.map(like => like.postId),
      commentedPosts: commented.map(comment => comment.postId),
    });
  } catch (err) {
    console.error('Error fetching user actions:', err);
    res.status(500).json({ message: 'Failed to fetch user actions' });
  }
});


// PUT /api/posts/:postId
router.put("/:postId", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: req.body, // Updates title, author, category, etc.
      },
      { new: true } // Returns the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Post update failed:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// DELETE /api/posts/:postId
router.delete("/:postId", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Post deletion failed:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get all post





//Update Search/Read Count
router.put('/post/view/:postId', async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { views: 1 } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Error incrementing view count" });
  }
});

router.post('/like', async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const existingLike = await Like.findOne({ userId, postId });
    if (existingLike) return res.status(400).json({ message: 'Already liked' });

    const newLike = new Like({ userId, postId });
    await newLike.save();
    res.status(200).json({ message: 'Liked' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to like post', error: err.message });
  }
});

router.post('/comment', async (req, res) => {
  const { userId, postId, text } = req.body;

  try {
    const newComment = new Comment({ userId, postId, text });
    await newComment.save();
    res.status(200).json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to comment', error: err.message });
  }
});





module.exports = router;
