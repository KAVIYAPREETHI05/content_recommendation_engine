// routes/readerRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

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

module.exports = router;
