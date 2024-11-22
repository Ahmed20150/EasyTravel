// server/touristRoutes.js

const express = require("express");
const router = express.Router();
const Tourist = require("../models/tourist.model");
const Itinerary = require("../models/itinerary.model");

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

//update booked Itenraries List and Pay with Wallet
router.patch("/bookItinerary", async (req, res) => {
  try {
    const { username, newBookedItineraries, selectedItineraryId } = req.body;

    // Fetch the itinerary price
    const itinerary = await Itinerary.findById(selectedItineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    const itineraryPrice = itinerary.priceOfTour;

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the tourist has enough balance
    if (tourist.wallet < itineraryPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Update the tourist's wallet and bookedItineraries array
    tourist.wallet -= itineraryPrice;
    tourist.bookedItineraries = newBookedItineraries;

    // Save the updated tourist document
    const updatedTourist = await tourist.save();

    res.status(200).json({
      message: "Itinerary booked successfully",
      bookedItineraries: updatedTourist.bookedItineraries,
      wallet: updatedTourist.wallet,
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/unbookItinerary", async (req, res) => {
  try {
    const { username, newBookedItineraries, selectedItineraryId } = req.body;

    // Fetch the itinerary price
    const itinerary = await Itinerary.findById(selectedItineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    const itineraryPrice = itinerary.priceOfTour;

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // refund itenerary price to wallet
    tourist.wallet += itineraryPrice;
    tourist.bookedItineraries = newBookedItineraries;

    // Save the updated tourist document
    const updatedTourist = await tourist.save();

    res.status(200).json({
      message: "Itinerary booked successfully",
      bookedItineraries: updatedTourist.bookedItineraries,
      wallet: updatedTourist.wallet,
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Update BookedItenraries list only
router.patch("/bookItineraryWithCreditCard", async (req, res) => {
  try {
    const { username, newItineraryId } = req.body;

    console.log("Username:", username);
    console.log("New Itinerary ID:", newItineraryId);

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const itinerary = await Itinerary.findById(newItineraryId);

    tourist.bookedItineraries.push(itinerary._id);

    await tourist.save();

    res.status(200).json({
      message: "Itinerary booked successfully",
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/checkWallet/:username/:itineraryId", async (req, res) => {
  try {
    const { username, itineraryId } = req.params;

    // Fetch the tourist data by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Fetch the itinerary data
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if wallet balance is sufficient
    if (tourist.wallet >= itinerary.priceOfTour) {
      return res
        .status(200)
        .json({ message: "Sufficient balance", sufficient: true });
    } else {
      return res
        .status(200)
        .json({ message: "Insufficient balance", sufficient: false });
    }
  } catch (error) {
    console.error("Error checking wallet balance:", error);
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

// Add or update preferences for a tourist by username
router.patch(
  "/tourist/:username/preferences",
  authenticate,
  async (req, res) => {
    const { preferences } = req.body; // Preferences passed as an array of preference names

    try {
      // Find the tourist by username
      const tourist = await Tourist.findOne({ username: req.params.username });
      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      // Verify the provided preferences exist in the Preference model

      // Update the tourist's preferences
      tourist.preferences = preferences;
      await tourist.save();

      res.status(200).json({
        message: "Preferences updated successfully",
        preferences: tourist.preferences,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Retrieve a tourist's preferences by username
router.get("/tourist/:username/preferences", authenticate, async (req, res) => {
  try {
    // Find the tourist by username
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ preferences: tourist.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
  const { eventIds } = req.body; // Array of itinerary IDs from the bookmarked events
  try {
    // Fetch itineraries by IDs
    const itineraries = await Itinerary.find({ _id: { $in: eventIds } });
    if (!itineraries.length) {
      return res.status(404).json({ message: "No itineraries found" });
    }
    res.status(200).json(itineraries);
  } catch (err) {
    console.error("Error fetching itineraries", err);
    res.status(500).json({ message: "Error fetching itineraries" });
  }
});

module.exports = router;

//fghjhjh
