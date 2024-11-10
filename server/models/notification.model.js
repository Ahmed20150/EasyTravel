const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: String, required: true }, // The recipient of the notification (activity creator)
  message: { type: String, required: true }, // The notification message
  timestamp: { type: Date, default: Date.now }, // Timestamp of when the notification was created
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
