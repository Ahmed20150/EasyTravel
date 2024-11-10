const express = require('express');
const router = express.Router();
const GiftItem = require("../models/giftitem.model.js"); 

// Get all gifts
router.get('/', async (req, res) => {
    try {
        const gifts = await GiftItem.find();
        res.json(gifts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gifts', error });
    }
});

router.post("/createGiftItem",async(req,res)=> {
    try{
      const giftitem = await GiftItem.create(req.body);
  
      res.status(200).json(giftitem); 
    } catch(error){
     res.status(500).json({message: error.message});
    }
  });

// Increment purchase count
router.post('/purchase/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const gift = await GiftItem.findById(id);
        if (!gift) {
            return res.status(404).json({ message: 'GiftItem not found' });
        }

        gift.purchases += 1; // Increment purchase count
        await gift.save(); // Save the updated gift

        res.json({ message: 'Purchase successful', gift });
    } catch (error) {
        res.status(500).json({ message: 'Error processing purchase', error });
    }
});

module.exports = router;