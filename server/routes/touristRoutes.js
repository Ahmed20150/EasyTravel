// server/touristRoutes.js

const express = require("express");
const router = express.Router();
const Tourist = require("../models/tourist.model"); // Adjust the path as needed

// Middleware for authentication (if needed)
const authenticate = (req, res, next) => {
  // Your authentication logic here
  next();
};

// Read Tourist Profile by username
router.get("/tourist/:username", authenticate, async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ username: req.params.username }); // Use findOne for username
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Tourist Profile by username
router.put("/tourist/:username", authenticate, async (req, res) => {
  const {
    username,
    email,
    mobileNumber,
    nationality,
    dateOfBirth,
    occupation,
  } = req.body;

  try {
    const tourist = await Tourist.findOneAndUpdate(
      { username: req.params.username }, // Update by username
      { email, mobileNumber, nationality, dateOfBirth, occupation },
      { new: true } // Return the updated document
    );

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save/Bookmark Event to Tourist Profile
router.patch("/bookmarkEvent", authenticate, async (req, res) => {
  const { username, eventId } = req.body;

  try {
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Add eventId to the bookmarkedEvents array
    if (!tourist.bookmarkedEvents.includes(eventId)) {
      tourist.bookmarkedEvents.push(eventId);
      await tourist.save();
    }

    res.status(200).json({ message: "Event bookmarked successfully", bookmarkedEvents: tourist.bookmarkedEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve Bookmarked Events for Tourist
router.get("/bookmarkedEvents/:username", authenticate, async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.json({ bookmarkedEvents: tourist.bookmarkedEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/bookItinerary", async (req, res) => {
  try {
    const { username, newBookedItineraries } = req.body;

    // Find the tourist by username and update the bookedItineraries array
    const updatedTourist = await Tourist.findOneAndUpdate(
      { username }, // Find tourist by username
      { bookedItineraries: newBookedItineraries }, // Update bookedItineraries array
      { new: true } // Return the updated document
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({
      message: "Itinerary booked successfully",
      bookedItineraries: updatedTourist.bookedItineraries,
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
