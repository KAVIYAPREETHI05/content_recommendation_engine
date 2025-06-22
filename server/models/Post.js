// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  publishedDate: Date,
  category: String,
  tags: [String],
  content: String,
  mediaUrl: String, // image or video URL
  creatorId: { type: String, required: true },
  views: { type: Number, default: 0 },        // <-- ADD THIS
  searchCount: { type: Number, default: 0 },  // <-- ADD THIS
}, { timestamps: true });


module.exports = mongoose.model("Post", postSchema);
