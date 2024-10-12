const express = require('express');
const TourGuide = require('../models/TourGuide');
const router = express.Router();

// Create a new tour guide profile
router.post('/', async (req, res) => {
  try {
    const newProfile = new TourGuide(req.body);
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tour guide profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await TourGuide.find();
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a tour guide profile by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProfile = await TourGuide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a tour guide profile by ID
router.delete('/:id', async (req, res) => {
  try {
    await TourGuide.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
