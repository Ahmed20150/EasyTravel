const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: String,  // Could be the user's username or user ID depending on your design
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;