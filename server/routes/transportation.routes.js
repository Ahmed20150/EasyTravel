// routes/transportation.js
const express = require('express');
const router = express.Router();
const Transportation = require('../models/bookTransportation.model'); // Adjust path as needed
const Advertiser = require('../models/advertiser.model');

// POST route to create a new transportation request
router.post('/add', async (req, res) => {
    try {
        const newTransportation = new Transportation(req.body);
        await newTransportation.save();
        res.status(201).json({ message: 'Transportation request created successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Route to get all advertiser usernames
router.get('/advertiser-usernames', async (req, res) => {
    try {
        // Fetch advertisers and only include the "username" field
        const advertisers = await Advertiser.find({}, 'username');
        res.json(advertisers.map(advertiser => advertiser.username)); // Send only the usernames in an array
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch advertiser usernames' });
    }
});


module.exports = router;
