const express = require('express');
const router = express.Router();
const Gift = require('../models/giftshop.model'); // Ensure the path is correct

// Get all gifts
router.get('/', async (req, res) => {
    try {
        const gifts = await Gift.find();
        res.json(gifts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gifts', error });
    }
});

// Increment purchase count
router.post('/:id/purchase', async (req, res) => {
    const { id } = req.params;

    try {
        const gift = await Gift.findById(id);
        if (!gift) {
            return res.status(404).json({ message: 'Gift not found' });
        }

        gift.amountOfPurchases += 1; // Increment purchase count
        await gift.save(); // Save the updated gift

        res.json({ message: 'Purchase successful', gift });
    } catch (error) {
        res.status(500).json({ message: 'Error processing purchase', error });
    }
});

module.exports = router;
