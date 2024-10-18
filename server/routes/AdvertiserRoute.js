const express = require('express');
const router = express.Router();
const Advertiser = require('../models/advertiser.model');
const multer = require('multer');

// Use memory storage instead of disk storage
const storage = multer.memoryStorage(); // Store file in memory

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed'), false);
  }
};

// Set up multer with memory storage and file filter
const upload = multer({
  storage, 
  fileFilter
});

router.post('/profileAdv', upload.single('companyProfile'), async (req, res) => {
  const { username, mobileNumber, companyName, website, hotline, dateOfBirth, profilePicture } = req.body;

  try {
    // Find advertiser profile by username or create a new one if not exists
    let profile = await Advertiser.findOne({ username });
    if (!profile) {
      profile = new Advertiser({ username });
    }

    // Update fields
    profile.companyName = companyName;
    profile.website = website;
    profile.hotline = hotline;
    profile.dateOfBirth = dateOfBirth;
    profile.mobileNumber = mobileNumber;

    // If a company profile PDF is uploaded, convert it to base64 and save it
    if (req.file && req.file.mimetype === 'application/pdf') {
      const companyProfileBase64 = req.file.buffer.toString('base64'); // Convert PDF file to base64 string
      profile.companyProfile = companyProfileBase64; // Store as base64 in MongoDB
    }

    // If a profile picture (base64) is provided, save it
    if (profilePicture) {
      profile.profilePicture = profilePicture;
    }

    // Save the updated or new profile
    await profile.save();

    // Send the updated profile as a response
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);

    // Check if the error is related to the PDF upload
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Error uploading file: ' + error.message });
    } else if (error.message === 'Only PDFs are allowed') {
      return res.status(400).json({ error: 'Only PDFs are allowed' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch profile by username
router.get('/profileAdv/:username', async (req, res) => {
  const { username } = req.params; // Get the username from URL params
  try {
    // Find the profile by username
    const profile = await Advertiser.findOne({ username });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile); // Return profile if found
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; // Export the router for use in other files
