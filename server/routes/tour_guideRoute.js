const express = require('express');
const router = express.Router();
const TourGuide = require('../models/tourGuide.model');

// Create or Update Profile
router.post('/profile', async (req, res) => {
  const { email, yearsOfExperience, previousWork, dateOfBirth } = req.body;
  try {
    let profile = await TourGuide.findOne({ email });
    if (!profile) {
      profile = new TourGuide({ email, yearsOfExperience, previousWork, dateOfBirth });
      await profile.save();
    } else {
      profile.yearsOfExperience = yearsOfExperience;
      profile.previousWork = previousWork;
      profile.dateOfBirth = dateOfBirth;
      await profile.save();
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Profile by Email
router.get('/profile/:email', async (req, res) => {
  try {
    const profile = await TourGuide.findOne({ email: req.params.email });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Profile by Email
router.put('/profile/:email', async (req, res) => {
  const { yearsOfExperience, previousWork, dateOfBirth } = req.body;
  try {
    const profile = await TourGuide.findOneAndUpdate(
      { email: req.params.email },
      { yearsOfExperience, previousWork, dateOfBirth },
      { new: true }
    );
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
