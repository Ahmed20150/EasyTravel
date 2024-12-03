const express = require('express');
const router = express.Router();
const GiftItem = require("../models/giftitem.model.js"); 
const Seller = require("../models/seller.model.js"); // Adjust the path as per your project structure
const sendEmail = require('../sendEmail'); // Include your email utility


// // Get all gifts
// router.get('/', async (req, res) => {
//     try {
//         const gifts = await GiftItem.find();
//         res.json(gifts);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching gifts', error });
//     }
// }); 
// Check all gift quantities and send email if any gift has quantity 0
// const checkGiftQuantities = async () => {
//     try {
//         const gifts = await GiftItem.find();  // Fetch all gift items

//         gifts.forEach((gift) => {
//             if (gift.quantity === 0) {
//                 // If the gift quantity is 0, send an email
//                 const subject = `Stock Alert: ${gift.name} is Out of Stock`;
//                 const text = `The gift item "${gift.name}" has run out of stock. Quantity: 0.`;

//                 // Send email (Adjust the email recipient as needed)
//                 sendEmail('youssefhipa887@gmail.com', subject, text)
//                     .then(response => {
//                         console.log(`Email sent successfully: ${response}`);
//                     })
//                     .catch(error => {
//                         console.log('Error sending email:', error);
//                     });
//             }
//         });
//     } catch (error) {
//         console.error('Error checking gift quantities:', error);
//     }
// };



 // Get all unarchived gifts
router.get('/', async (req, res) => {
    try {
        // Fetch gifts where 'archived' is false
        const gifts = await GiftItem.find({ archived: false });
        res.json(gifts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gifts', error });
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

// // Increment purchase count
// router.post('/purchase/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const gift = await GiftItem.findById(id);
//         if (!gift) {
//             return res.status(404).json({ message: 'GiftItem not found' });
//         }

//         gift.purchases += 1; // Increment purchase count
//         await gift.save(); // Save the updated gift

//         res.json({ message: 'Purchase successful', gift });
//     } catch (error) {
//         res.status(500).json({ message: 'Error processing purchase', error });
//     }
// });


// Increment purchase count and decrease quantity by 1
router.post('/purchase/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the gift item by ID
        const gift = await GiftItem.findById(id);
        if (!gift) {
            return res.status(404).json({ message: 'GiftItem not found' });
        }

        // Increment the purchase count
        gift.purchases += 1;

        // Decrease the quantity by 1
        if (gift.quantity > 0) {
            gift.quantity -= 1;
        } else {
            return res.status(400).json({ message: 'Not enough quantity to complete the purchase' });
        }

        // Save the updated gift
        await gift.save();

        // Check if quantity is now 0 and send email notification to the seller
        if (gift.quantity === 0) {
            // Find the seller's email using the seller username from the gift item
            const seller = await Seller.findOne({ username: gift.seller });
            if (!seller) {
                return res.status(404).json({ message: 'Seller not found' });
            }

            // Send an email to the seller
            await sendEmail(
                seller.email,
                'Gift Out of Stock Notification',
                `The gift item "${gift.name}" is now out of stock.`
            );
        }

        res.json({ message: 'Purchase successful', gift });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing purchase', error });
    }
});


module.exports = router;