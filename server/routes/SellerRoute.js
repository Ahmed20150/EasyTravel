const express = require('express');
const router = express.Router();
const Seller = require('../models/seller.model');

// Create or Update Profile
router.post('/profileSeller', async (req, res) => {
  const { username, mobileNumber, firstLastName,description, dateOfBirth,profilePicture } = req.body;
  try {
    let profile = await Seller.findOne({ username });
    profile.dateOfBirth = dateOfBirth;
    profile.firstLastName = firstLastName;
    profile.description = description;
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
router.get('/profileSeller/:username', async (req, res) => {
  const { username } = req.params; // Get the username from the URL params
  try {
    const profile = await Seller.findOne({ username });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile); // Return the profile if found
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
