// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String, // MySQL UUID
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Session', sessionSchema);
