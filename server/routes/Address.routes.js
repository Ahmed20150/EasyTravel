const express = require('express');
const router = express.Router();
const Tourist = require('../models/tourist.model.js'); // Import the Tourist model

// Route to add a new address for a tourist
router.post('/tourists/:username/addresses', async (req, res) => {
  try {
    const { username } = req.params;
    const { street, city, state, postalCode, country, label } = req.body;

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found!' });
    }

    // Check if the address already exists (optional)
    const existingAddress = tourist.addresses.find(
      (address) => address.street === street && address.city === city
    );

    if (existingAddress) {
      return res.status(400).json({ error: 'Address already exists!' });
    }

    // Add the new address to the tourist's addresses array
    tourist.addresses.push({
      street,
      city,
      state,
      postalCode,
      country,
      label: label || 'Home', // Default label if not provided
    });

    // Save the tourist with the new address
    await tourist.save();

    // Return the address added instead of the whole tourist object
    return res.status(200).json({
      message: 'Address added successfully!',
      address: tourist.addresses[tourist.addresses.length - 1], // Return the latest added address
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add address.' });
  }
});

// Route to get all addresses for a specific tourist
router.get('/tourists/:username/addresses', async (req, res) => {
    try {
      const { username } = req.params;
  
      console.log(`Fetching addresses for username: ${username}`); // Debugging log
  
      const tourist = await Tourist.findOne({ username });
  
      if (!tourist) {
        console.error(`Tourist with username ${username} not found`); // Debugging log
        return res.status(404).json({ error: 'Tourist not found!' });
      }
  
      // Return only the addresses part of the tourist data
      console.log(`Addresses found: ${tourist.addresses.length}`); // Debugging log
      res.status(200).json(tourist.addresses); // Return the list of addresses
    } catch (error) {
      console.error('Error fetching addresses:', error); // Log error for debugging
      res.status(500).json({ error: 'Error fetching tourist addresses.' });
    }
  });
  

  router.put('/tourists/:username/addresses/:addressId/default', async (req, res) => {
    const { username, addressId } = req.params;
  
    try {
      // Find the tourist by username
      const tourist = await Tourist.findOne({ username });
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      // Check if the address exists in the tourist's addresses array
      const address = tourist.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      // Set all addresses' isDefault to false and the selected one to true
      tourist.addresses.forEach((addr) => (addr.isDefault = false));
      address.isDefault = true;
  
      // Save changes
      await tourist.save();
  
      res.json({ message: 'Default address set successfully', address });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Route to edit an address for a tourist
// Route to edit an address for a tourist
router.put('/tourists/:username/addresses/:label', async (req, res) => {
    try {
      const { username, label } = req.params;
      const { street, city, state, postalCode, country, newLabel, isDefault } = req.body;
  
      // Find the tourist by username
      const tourist = await Tourist.findOne({ username });
  
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found!' });
      }
  
      // Find the address to be edited
      const addressToEdit = tourist.addresses.find(
        (address) => address.label === label
      );
  
      if (!addressToEdit) {
        console.error('Address not found:', label); // Add this for debugging
        return res.status(404).json({ error: 'Address not found!' });
      }
      
  
      // Update the address details
      addressToEdit.street = street || addressToEdit.street;
      addressToEdit.city = city || addressToEdit.city;
      addressToEdit.state = state || addressToEdit.state;
      addressToEdit.postalCode = postalCode || addressToEdit.postalCode;
      addressToEdit.country = country || addressToEdit.country;
      addressToEdit.label = newLabel || addressToEdit.label;
  
      // Handle `isDefault` update if provided
      if (isDefault !== undefined) {
        // Reset all addresses to not be default
        tourist.addresses.forEach((address) => {
          address.isDefault = false;
        });
  
        // If `isDefault` is true, set this address as the default
        if (isDefault) {
          addressToEdit.isDefault = true;
        }
      }
  
      // Save the changes
      await tourist.save();
  
      return res.status(200).json({
        message: 'Address updated successfully!',
        address: addressToEdit,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update address.' });
    }
  });
  
  router.delete('/tourists/:username/addresses/:label', async (req, res) => {
    try {
        console.log(`Deleting address for ${req.params.username}, label: ${req.params.label}`);

        const { username, label } = req.params;
        const tourist = await Tourist.findOne({ username });

        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found!' });
        }

        // Find the index of the address to remove
        const addressIndex = tourist.addresses.findIndex(
            (address) => address.label.trim() === label.trim()
        );

        if (addressIndex === -1) {
            return res.status(404).json({ error: 'Address not found!' });
        }

        // Remove the address by index
        tourist.addresses.splice(addressIndex, 1);

        // Save the updated tourist document
        await tourist.save();

        res.status(200).json({
            message: `Address '${label}' has been removed.`,
            remainingAddresses: tourist.addresses.length,
        });
    } catch (error) {
        console.error('Error occurred while removing address:', error);
        return res.status(500).json({ error: 'Failed to remove address.' });
    }
});

  

module.exports = router;
