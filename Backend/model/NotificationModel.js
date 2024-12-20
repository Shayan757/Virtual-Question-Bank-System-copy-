// models/NotificationModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to the User model
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // Mark notification as read or unread
  timestamp: { type: Date, default: Date.now }, // Timestamp for notification
});

module.exports = mongoose.model('Notification', NotificationSchema);
