// models/MessageModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false }, // Reference to the User model
  message: { type: String, required: true },
  adminResponse: { type: String }, // Field for the admin's response
  isAdminResponse: { type: Boolean, default: false }, // Distinguishes between user messages and admin responses
  timestamp: { type: Date, default: Date.now }, // Timestamp for message
});

module.exports = mongoose.model('Message', MessageSchema);
