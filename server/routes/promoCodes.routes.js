const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode.model');

// Create a new promo code
router.post('/create', async (req, res) => {
    const { promoCode, discount, expiryDate } = req.body;

    console.log('Received Data:', req.body);

    // Validate inputs
    if (!promoCode || !discount || !expiryDate) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate promoCode format (length and regex)
    const promoCodeRegex = /^[A-Za-z0-9]{4,10}$/;
    if (!promoCodeRegex.test(promoCode)) {
        return res.status(400).json({ message: 'Promo code must be between 4 and 10 alphanumeric characters.' });
    }

    // Validate discount (must be a positive number)
    if (isNaN(discount) || discount <= 0) {
        return res.status(400).json({ message: 'Discount must be a positive number.' });
    }

    // Validate expiryDate (must be a valid date)
    if (isNaN(Date.parse(expiryDate))) {
        return res.status(400).json({ message: 'Expiry date must be valid.' });
    }

    try {
        // Create a new promo code
        const newPromoCode = new PromoCode({ promoCode, discount, expiryDate });

        // Log the promo code before saving
        console.log('Creating promo code:', newPromoCode);

        // Save the promo code
        await newPromoCode.save();

        // Log after saving
        console.log('Promo code saved successfully!');

        // Send success message
        return res.status(201).json({ message: 'Promo code created successfully!' });
    } catch (error) {
        // Handle error if the promo code creation fails
        console.error('Error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get all promo codes
router.get('/', async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.status(200).json(promoCodes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a promo code by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await PromoCode.findByIdAndDelete(id);
        res.status(200).json({ message: 'Promo code deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;