const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // reader1234 or creator1234
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['reader', 'creator'], required: true },
});

module.exports = mongoose.model('User', userSchema);
