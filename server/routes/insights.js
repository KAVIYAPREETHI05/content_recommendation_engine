const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const Post = require("../models/Post");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/suggestions/:creatorId", async (req, res) => {
  try {
    const posts = await Post.find({ creatorId: req.params.creatorId });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this creator." });
    }

    const categories = posts.map(post => post.category);
    const categoryCounts = {};
    categories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const prompt = `Based on these popular blog categories: ${sortedCategories.join(", ")}, suggest 5 new blog post ideas a creator could write to increase reader engagement.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestions = aiResponse.choices[0].message.content;
    res.json({ suggestions });
  } catch (err) {
    console.error("AI suggestion error:", err.response?.data || err.message || err);
    res.status(500).json({ message: "Error generating suggestions", error: err.message });
  }
});

module.exports = router;
