const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const cors = require("cors");
const Activity = require("../models/activity.model.js");
router.use(express.json());
router.use(cookieParser());
router.use(cors()); // This allows requests from any origin

// Simple in-memory store for notifications
let notifications = [];

// Function to send a system message to the creator
const sendSystemMessage = (creatorUsername, message) => {
  notifications.push({
    username: creatorUsername,
    message: message,
    timestamp: new Date(),
  });
};

// CREATE
router.post("/", async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).send({ errors });
    }
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the activity." });
  }
});

// READ (Get all activities)
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (Get specific activity)
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedActivity);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).send({ errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all activities by username
router.delete("/deleteAll/:username", async (req, res) => {
  try {
    await Activity.deleteMany({ creator: req.params.username });
    res.status(200).json({ message: "All activities deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH - Update flagged status and send system message
// PATCH - Flag an activity
// PATCH to flag an activity
router.patch("/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { flagged: req.body.flagged }, // Update the 'flagged' field
      { new: true }  // Ensure the updated document is returned
    );

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(activity); // Return updated activity
  } catch (error) {
    console.error("Error updating flagged status:", error);
    res.status(500).json({ error: "Error updating flagged status" });
  }
});



// Optional: Endpoint to retrieve notifications for a user
router.get("/notifications/:username", async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.username });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;

