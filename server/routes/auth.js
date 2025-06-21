const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- JWT package
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
// ⛔ Change this to a secure, hidden key in production

// Generate unique ID
function generateID(role) {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return role === 'reader' ? `reader${suffix}` : `creator${suffix}`;
}

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) return res.status(400).send('Missing fields');

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = generateID(role);

  try {
    const user = new User({ id, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created', id });
  } catch (error) {
    res.status(500).json({ error: 'User creation failed' });
  }
});

// Login Route with JWT
router.post('/login', async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) return res.status(400).send('Missing ID or password');

  try {
    const user = await User.findOne({ id });
    if (!user) return res.status(401).json({ message: "Invalid ID" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // payload
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token with response
    res.status(200).json({
      message: 'Login successful',
      role: user.role,
      id: user.id,
      token // <--- return the token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
