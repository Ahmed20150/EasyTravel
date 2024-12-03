const express = require('express');
const router = express.Router();
const Seller = require('../models/seller.model');




// seller: Add a new gift item with its details, price, and available quantity
router.post('/addGiftItem', async (req, res) => {
  const { name, image, description, price, purchases,quantity, date, seller} = req.body;

  try {
      // Creating a new GiftItem with purchases and date fields included
      const newGiftItem = new GiftItem({
          name,
          image,
          description,
          price,
          purchases: purchases || 0,  // Defaults to 0 if not provided
          quantity,
          date,
          seller,
      });

      await newGiftItem.save();
      res.status(201).json({ message: 'Gift item added successfully', newGiftItem });
  } catch (error) {
      res.status(500).json({ message: 'Error adding gift item', error });
  }
});

// seller: Update an existing gift item
router.put('/updateGiftItem/:id', async (req, res) => {
  const { id } = req.params;
  const { name, image, description, price, purchases,quantity, date,seller } = req.body;

  try {
      const updatedGiftItem = await GiftItem.findByIdAndUpdate(
          id,
          { name, image, description, price, purchases,quantity, date,seller },
          { new: true }
      );

      if (!updatedGiftItem) {
          return res.status(404).json({ message: 'Gift item not found' });
      }

      res.status(200).json({ message: 'Gift item updated successfully', updatedGiftItem });
  } catch (error) {
      res.status(500).json({ message: 'Error updating gift item', error });
  }
});

// seller: Delete a gift item
router.delete('/deleteGiftItem/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const deletedGiftItem = await GiftItem.findByIdAndDelete(id);

      if (!deletedGiftItem) {
          return res.status(404).json({ message: 'Gift item not found' });
      }
      res.status(200).json({ message: 'Gift item deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting gift item', error });
  }
});


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
