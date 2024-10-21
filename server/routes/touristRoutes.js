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
