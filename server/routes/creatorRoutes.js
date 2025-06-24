const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Using User model, not Creator

// Get creator by custom ID (e.g., "creator4531")
router.get("/:creatorID", async (req, res) => {
  const { creatorID } = req.params;

  try {
    const creator = await User.findOne({ id: creatorID, role: "creator" }).select("-password");

    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    res.json(creator);
  } catch (err) {
    console.error("Error fetching creator:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
