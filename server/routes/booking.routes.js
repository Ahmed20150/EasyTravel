const express = require("express");
const router = express.Router();
const Tourist = require("../models/tourist.model"); 
const Itinerary = require("../models/itinerary.model"); 
const Booking = require("../models/booking.model");


router.post("/createBooking", async (req, res) => {
    try {
      const { touristUsername, itineraryId, bookingDate, bookingTime } = req.body;
  
      // Validate the input data
      if (!touristUsername || !itineraryId || !bookingDate || !bookingTime) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Find the tourist by touristUsername
      const tourist = await Tourist.findOne({ username: touristUsername });
      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }
  
      // Find the itinerary by ID
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
  
      // Create a new booking entry
      const newBooking = new Booking({
        touristUsername,
        itineraryId,
        bookingDate,
        bookingTime,
      });
  
      // Save the booking to the database
      await newBooking.save();
  
      res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get('/getBooking/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the booking by ID
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      res.status(200).json(booking);
    } catch (error) {
      console.error('Error getting booking:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  //get booking by itenraryid and username
  router.get("/getBooking/:itineraryId/:touristUsername", async (req, res) => {
    try {
      const { itineraryId, touristUsername } = req.params;
      // Find the booking by itineraryId and tourist
      const booking = await Booking.findOne({ itineraryId, touristUsername });
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      console.error("Error getting booking:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  //delete booking by ItenraryId & username 
  router.delete("/deleteBooking/:itineraryId/:touristUsername", async (req, res) => {
    try {
      const { itineraryId, touristUsername } = req.params;
      // Find the booking by itineraryId and touristUsername
      const booking = await Booking.findOneAndDelete({ touristUsername, itineraryId });
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/pastBookings", async (req, res) => {
    try {
      const { username } = req.query; // Change from req.body to req.query
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
  
      const today = new Date();
      const pastBookings = await Booking.find({
        touristUsername: username,
        bookingDate: { $lt: today },
      });
  
      res.status(200).json(pastBookings);
    } catch (error) {
      console.error("Error fetching past bookings:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/upcomingBookings", async (req, res) => {
    try {
      const { username } = req.query; // Change from req.body to req.query
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
  
      const today = new Date();
      const upcomingBookings = await Booking.find({
        touristUsername: username,
        bookingDate: { $gt: today },
      });
  
      res.status(200).json(upcomingBookings);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;