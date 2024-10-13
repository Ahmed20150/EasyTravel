const express = require('express');
const multer = require('multer'); // Import multer for handling file uploads
const router = express.Router();
const Advertiser = require('../models/advertiser.model');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory to save the uploaded file
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Append the current timestamp to the filename
  }
});

const upload = multer({ storage }); // Initialize multer with the defined storage configuration

// Create or Update Profile
router.post('/profileAdv', upload.single('companyProfile'), async (req, res) => {
  const { username, mobileNumber, companyName, website, hotline,companyProfile ,dateOfBirth,profilePicture } = req.body;

  try {
    let profile = await Advertiser.findOne({ username });
    if (!profile) {
      profile = new Advertiser({ username });
    }


    profile.companyName = companyName;
    profile.website = website;
    profile.hotline = hotline;
    profile.companyProfile = companyProfile;
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
router.get('/profileAdv/:username', async (req, res) => {
  const { username } = req.params; // Get the username from the URL params
  try {
    const profile = await Advertiser.findOne({ username });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile); // Return the profile if found
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; // Export the router for use in other files
