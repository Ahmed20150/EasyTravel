const express = require('express');
const router = express.Router();
const TourGuide = require('../models/tourGuide.model');

// Create or Update Profile
router.post('/profile', async (req, res) => {
  const { username, mobileNumber, yearsOfExperience, previousWork, dateOfBirth,profilePicture } = req.body;
  try {
    let profile = await TourGuide.findOne({ username });
      // Update the existing profile
    profile.yearsOfExperience = yearsOfExperience;
    profile.previousWork = previousWork;
    profile.dateOfBirth = dateOfBirth;
    profile.mobileNumber = mobileNumber;
    if (profilePicture) {
      profile.profilePicture = profilePicture; // Save the base64 image string
    }
    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a GET route to fetch profile by username
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params; // Get the username from the URL params
  try {
    const profile = await TourGuide.findOne({ username });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile); // Return the profile if found
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Assuming the route is set up in tourGuide.routes.js or a similar file

// Route to find a tour guide by username
router.get("/tourguide/username/:username", async (req, res) => {
  const { username } = req.params;
  
  try {
    const tourGuide = await TourGuide.findOne({ username: username }); // Assuming 'creator' is the username
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    res.json(tourGuide); // Return the full TourGuide document
  } catch (error) {
    res.status(500).json({ error: "Error finding tour guide" });
  }
});


module.exports = router;
