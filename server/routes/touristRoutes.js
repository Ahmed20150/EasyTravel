const express = require("express");
const router = express.Router();
const Tourist = require("../models/tourist.model"); // Adjust the path as needed
const Itinerary = require('../models/itinerary.model'); // Adjust the path based on where your Itinerary model is located


// Middleware for authentication (if needed)
const authenticate = (req, res, next) => {
  // Your authentication logic here
  next();
};

// Read Tourist Profile by username
router.get("/tourist/:username", authenticate, async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ username: req.params.username })
      .populate("bookedItineraries") // Populate booked itineraries with actual itinerary data
      .exec();
      
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

// Route to get the list of bookmarked events
router.get("/bookmarkedEvents/:username", authenticate, async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.json({ bookmarkedEvents: tourist.bookmarkedEvents });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookmarked events" });
  }
});

// Route to add an event to the tourist's bookmarks
router.patch("/bookmarkEvent", authenticate, async (req, res) => {
  const { username, eventId } = req.body;

  try {
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Add the eventId to the bookmarkedEvents array if not already added
    if (!tourist.bookmarkedEvents.includes(eventId)) {
      tourist.bookmarkedEvents.push(eventId);
    } else {
      // If the event is already bookmarked, remove it
      tourist.bookmarkedEvents = tourist.bookmarkedEvents.filter(
        (id) => id !== eventId
      );
    }

    await tourist.save(); // Save the updated tourist document

    res.status(200).json({ message: "Bookmark status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating bookmark status" });
  }
});
router.post("/itineraries/fetch", async (req, res) => {
  const { eventIds } = req.body;  // Array of itinerary IDs from the bookmarked events
  try {
    // Fetch itineraries by IDs
    const itineraries = await Itinerary.find({ '_id': { $in: eventIds } });
    if (!itineraries.length) {
      return res.status(404).json({ message: "No itineraries found" });
    }
    res.status(200).json(itineraries);
  } catch (err) {
    console.error("Error fetching itineraries", err);
    res.status(500).json({ message: "Error fetching itineraries" });
  }
});


// Route to book an itinerary
router.patch("/bookItinerary", authenticate, async (req, res) => {
  const { username, newBookedItineraries } = req.body;

  try {
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
