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
    const { username, newItineraryId} = req.body;

    console.log('Username:', username);
    console.log('New Itinerary ID:', newItineraryId);

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

router.get('/checkWallet/:username/:itineraryId', async (req, res) => {
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
      return res.status(200).json({ message: "Sufficient balance", sufficient: true });
    } else {
      return res.status(200).json({ message: "Insufficient balance", sufficient: false });
    }
  } catch (error) {
    console.error("Error checking wallet balance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
