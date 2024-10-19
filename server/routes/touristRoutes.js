// server/touristRoutes.js

const express = require('express');
const router = express.Router();
const Tourist = require('../models/tourist.model'); // Adjust the path as needed

// Middleware for authentication (if needed)
const authenticate = (req, res, next) => {
    // Your authentication logic here
    next();
};

// Read Tourist Profile by username
router.get('/tourist/:username', authenticate, async (req, res) => {
    try {
        const tourist = await Tourist.findOne({ username: req.params.username }); // Use findOne for username
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.json(tourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Tourist Profile by username
router.put('/tourist/:username', authenticate, async (req, res) => {
    const { username, email, mobileNumber, nationality, dateOfBirth, occupation } = req.body;

    try {
        const tourist = await Tourist.findOneAndUpdate(
            { username: req.params.username }, // Update by username
            { email, mobileNumber, nationality, dateOfBirth, occupation },
            { new: true } // Return the updated document
        );

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.json(tourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
