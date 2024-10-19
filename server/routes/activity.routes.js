const express = require("express");
const router = express.Router();
const cors = require("cors");
const Activity = require("../models/activity.model.js");
router.use(express.json());
router.use(cors()); // This allows requests from any origin

// CREATE
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const newActivity = new Activity(req.body);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while saving the activity." });
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
      { new: true }
    );
    res.status(200).json(updatedActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

module.exports = router;
