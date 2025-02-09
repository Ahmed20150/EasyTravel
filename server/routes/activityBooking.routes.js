const express = require('express');
const router = express.Router();
const ActivityBooking = require('../models/ActivityBooking');

// Create a new activity booking
router.post('/createActivityBooking', async (req, res) => {
    try {
        const { touristUsername, activityId, bookingDate, bookingTime } = req.body;

        const newBooking = new ActivityBooking({
            touristUsername,
            activityId,
            bookingDate,
            bookingTime
        });

        await newBooking.save();
        res.status(201).json({ message: 'Activity booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating activity booking:', error);
        res.status(500).json({ message: 'Failed to create activity booking', error: error.message });
    }
});

// Update the route to get bookings for a specific tourist
router.get('/tourist/:username', async (req, res) => {
    try {
        const bookings = await ActivityBooking.find({ 
            touristUsername: req.params.username 
        })
        .populate('activityId') // This will populate the activity details
        .sort({ bookingDate: -1 }); // Sort by date descending

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching tourist bookings:', error);
        res.status(500).json({ 
            message: 'Error fetching bookings', 
            error: error.message 
        });
    }
});

// Add this route to handle unbooking
router.delete('/unbook/:bookingId', async (req, res) => {
    try {
        const booking = await ActivityBooking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Calculate time difference in hours
        const bookingDate = new Date(booking.bookingDate);
        const currentDate = new Date();
        const diffInHours = (bookingDate - currentDate) / (1000 * 60 * 60);

        if (diffInHours < 48) {
            return res.status(400).json({
                message: 'Cannot unbook activities within 48 hours of the booking date'
            });
        }

        await ActivityBooking.findByIdAndDelete(req.params.bookingId);
        res.json({ message: 'Activity unbooked successfully' });
    } catch (error) {
        console.error('Error unbooking activity:', error);
        res.status(500).json({ message: 'Error unbooking activity', error: error.message });
    }
});

// Add this route to check if an activity is booked by a user
router.get('/check/:activityId/:username', async (req, res) => {
    try {
        const booking = await ActivityBooking.findOne({
            activityId: req.params.activityId,
            touristUsername: req.params.username
        });
        res.json({
            isBooked: !!booking,
            bookingId: booking?._id,
            bookingDate: booking?.bookingDate
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking booking status', error: error.message });
    }
});

// Add this route to check existing booking
router.get('/checkBooking/:activityId/:username', async (req, res) => {
    try {
        const { activityId, username } = req.params;
        const existingBooking = await ActivityBooking.findExistingBooking(username, activityId);

        if (existingBooking) {
            res.json({
                isBooked: true,
                bookingId: existingBooking._id,
                bookingDate: existingBooking.bookingDate,
                bookingTime: existingBooking.bookingTime
            });
        } else {
            res.json({ isBooked: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking booking status', error: error.message });
    }
});

// Add this route to get past activity bookings
router.get("/pastBookings", async (req, res) => {
    try {
        const { username } = req.query;
        const currentDate = new Date();

        const bookings = await ActivityBooking.find({
            touristUsername: username,
            bookingDate: { $lt: currentDate }
        }).populate('activityId');

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching past activity bookings:", error);
        res.status(500).json({ message: "Error fetching past bookings" });
    }
});

// Add this route to get upcoming bookings
router.get('/upcomingBookings', async (req, res) => {
  try {
    const { username, currentDate } = req.query;
    
    const upcomingBookings = await ActivityBooking.find({
      touristUsername: username,
      bookingDate: { $gt: new Date(currentDate) }
    }).sort({ bookingDate: 1 });

    res.json(upcomingBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming bookings' });
  }
});

module.exports = router; 