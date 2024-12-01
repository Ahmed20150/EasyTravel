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

//Get with Id
router.get('/:id', async (req, res) => {
    try {
        const giftItem = await GiftItem.findById(req.params.id);
        if (!giftItem) {
            return res.status(404).json({ message: 'Gift item not found' });
        }
        res.json(giftItem);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gift item', error });
    }
});




// Get all gift items along with their revenue (with optional filter by name)
router.get('/filter/itemsWithRevenue', async (req, res) => {
    try {
        const { name } = req.query; // Optional query parameter to filter by a specific item name

        // Build a filter if a name is provided
        const filter = name ? { name: { $regex: new RegExp(name, 'i') } } : {};

        // Fetch all gift items, calculating their revenue
        const giftItems = await GiftItem.aggregate([
            { $match: filter }, // Apply the filter if a name is provided
            {
                $project: {
                    name: 1, // Include name field
                    revenue: { $multiply: ["$price", "$purchases"] }, // Calculate revenue
                    
                    
                }
            }
        ]);

        res.status(200).json(giftItems);
    } catch (error) {
        console.error('Error fetching gift items with revenue:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});



// Get gift items with their revenue filtered by date
router.get('/filter/byDate', async (req, res) => {
    try {
        const { date } = req.query; // Get the date from query params

        if (!date) {
            return res.status(400).json({ message: 'Please provide a date in the format YYYY-MM-DD' });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Find gift items matching the provided date
        const giftItems = await GiftItem.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
                        $lt: new Date(parsedDate.setHours(23, 59, 59, 999)) // End of the day
                    }
                }
            },
            {
                $project: {
                    name: 1, // Include name field
                    revenue: { $multiply: ["$price", "$purchases"] }, // Calculate revenue
                    date: 1 // Include the date field (optional)
                }
            }
        ]);

        res.status(200).json(giftItems);
    } catch (error) {
        console.error('Error filtering gift items by date:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


// Get gift items with their revenue filtered by month (no year)
router.get('/filter/byMonth', async (req, res) => {
    try {
        const { month } = req.query; // Get the month from query parameters

        // Validate input
        if (!month) {
            return res.status(400).json({ message: 'Please provide the month in the query parameters.' });
        }

        const parsedMonth = parseInt(month, 10); // Convert month to a number

        if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
            return res.status(400).json({ message: 'Invalid month. Month should be between 1 and 12.' });
        }

        // Fetch gift items where the month from the 'date' field matches the requested month
        const giftItems = await GiftItem.aggregate([
            {
                $project: {
                    name: 1, // Include name field
                    price: 1, // Include price field
                    purchases: 1, // Include purchases field
                    date: 1, // Include date field
                    month: { $month: "$date" }, // Extract the month from the date field
                    year: { $year: "$date" } // Extract the year (not needed for filtering, just in case)
                }
            },
            {
                $match: {
                    month: parsedMonth // Match the extracted month with the query parameter
                }
            },
            {
                $project: {
                    name: 1, // Include name field
                    revenue: { $multiply: ["$price", "$purchases"] }, // Calculate revenue
                    date: 1 // Include date field (optional)
                }
            }
        ]);

        res.status(200).json(giftItems);
    } catch (error) {
        console.error('Error filtering gift items by month:', error);
        res.status(500).json({ message: 'Server error', error });
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

router.post('/:id/review', async (req, res) => {
    const { username, rating, review } = req.body;

    if (!username || !rating || !review) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const giftItem = await GiftItem.findById(req.params.id);
        if (!giftItem) {
            return res.status(404).json({ message: 'Gift item not found' });
        }

        giftItem.reviews.push({ username, rating, review });
        await giftItem.save();

        res.status(200).json({ message: 'Review added successfully', giftItem });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
});

module.exports = router;