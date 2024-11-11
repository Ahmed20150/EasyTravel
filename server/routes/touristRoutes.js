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
      { newBookedItineraries: newBookedItineraries }, // Update bookedItineraries array
      { new: true } // Return the updated document
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({
      message: "Itinerary booked successfully",
      bookedItineraries: updatedTourist.newBookedItineraries,
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/bookFlights", async (req, res) => {
  try {
    console.log("Raw request body:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);

    const { username, newBookedFlightId } = req.body;
    console.log("Parsed request:", { username, newBookedFlightId });

    if (!username || !newBookedFlightId) {
      console.log("Missing fields:", { username, newBookedFlightId });
      return res.status(400).json({
        message: "Missing required fields",
        received: { username, newBookedFlightId },
      });
    }

    // Get current tourist data
    const tourist = await Tourist.findOne({ username });
    console.log("Found tourist:", tourist);

    if (!tourist) {
      return res.status(404).json({
        message: "Tourist not found",
        username: username,
      });
    }

    // Ensure BookedFlights is initialized as an array
    const currentFlights = tourist.BookedFlights || [];
    const updatedFlights = [...currentFlights, newBookedFlightId];

    console.log("Current flights:", currentFlights);
    console.log("Updated flights:", updatedFlights);

    const updatedTourist = await Tourist.findOneAndUpdate(
      { username },
      { $set: { BookedFlights: updatedFlights } },
      { new: true }
    );

    console.log("Updated tourist:", updatedTourist);

    res.status(200).json({
      message: "Flight booked successfully",
      bookedFlights: updatedTourist.BookedFlights,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
