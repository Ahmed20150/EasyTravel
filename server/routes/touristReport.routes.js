const express = require('express');
const Itinerary = require("../models/itinerary.model.js");

const router = express.Router();

router.get('/tourist-report', async (req, res) => {
  try {
    
    const month = parseInt(req.query.month, 10);

    if (month && month >= 1 && month <= 12) {
      
      const monthStr = month < 10 ? '0' + month : month;

      
      const startDate = new Date(`2024-${monthStr}-01T00:00:00Z`);

      
      const endDate = new Date(`2024-${monthStr}-01T23:59:59.999Z`);

      // Adjust the endDate to be the last day of the month dynamically
      endDate.setMonth(endDate.getMonth() + 1);  // Move to the next month
      endDate.setDate(0);  // Set to the last day of the previous month
      endDate.setHours(23, 59, 59, 999); // Set the time to the last millisecond of the day

      // Aggregate the itineraries by matching the availableDates within the selected month
      const totalTouristsByMonth = await Itinerary.aggregate([
        {
          $match: {
            availableDates: { 
              $elemMatch: {
                $gte: startDate,  // Greater than or equal to the start of the month
                $lt: endDate      // Less than the start of the next month
              }
            }
          }
        },
        {
          $project: {
            totalTourists: { $size: '$touristsBooked' }  // Count the number of tourists in the touristsBooked array
          }
        },
        {
          $group: {
            _id: null,
            totalTourists: { $sum: '$totalTourists' }  // Sum the total tourists across all itineraries for the selected month
          }
        }
      ]);

      if (totalTouristsByMonth.length === 0) {
        return res.status(404).json({ success: false, message: 'No tourists found for the selected month.' });
      }

      return res.json({ totalTourists: totalTouristsByMonth[0].totalTourists });
    } else {
      // If no month is provided or the month is invalid, get the total number of tourists across all itineraries
      const totalTourists = await Itinerary.aggregate([
        {
          $project: {
            totalTourists: { $size: '$touristsBooked' }  // Count the number of tourists in the touristsBooked array
          }
        },
        {
          $group: {
            _id: null,
            totalTourists: { $sum: '$totalTourists' }  // Sum the total tourists across all itineraries
          }
        }
      ]);

      if (totalTourists.length === 0) {
        return res.status(404).json({ success: false, message: 'No tourists found for any itinerary.' });
      }

      return res.json({ totalTourists: totalTourists[0].totalTourists });
    }
  } catch (error) {
    console.error('Error fetching tourist report:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tourist report' });
  }
});

module.exports = router;
