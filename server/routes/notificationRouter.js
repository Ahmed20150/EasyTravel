// notificationRouter.js
const express = require("express");
const Notification = require("../models/notification.model.js"); 
const router = express.Router();

// GET endpoint to retrieve notifications for a user
router.get("/:username", async (req, res) => {
  try {
    // Find notifications by username
    const notifications = await Notification.find({ user: req.params.username });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
