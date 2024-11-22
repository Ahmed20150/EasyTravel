const express = require("express");
const router = express.Router();
const Activity = require("../models/activity.model.js");

// Route to get the total number of tourists, with an optional month filter
router.get("/total-tourists", async (req, res) => {
  try {
    const { month } = req.query;

    // Check if a valid month is provided for filtering
    if (month && (isNaN(month) || month < 1 || month > 12)) {
      return res.status(400).json({ message: "Invalid month provided" });
    }

    let matchStage = {};

    // If month is provided, add a match stage to filter by the month only
    if (month) {
      matchStage = {
        $expr: {
          $eq: [{ $month: "$date" }, parseInt(month)]
        }
      };
    }

    // Aggregate activities based on the provided filters
    const totalTourists = await Activity.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalTourists: { $sum: "$numofpurchases" } } }
    ]);

    // Check if there are any results
    if (totalTourists.length === 0) {
      return res.status(200).json({ message: "No tourists found." });
    }

    // Return the total tourists
    res.status(200).json({
      totalTourists: totalTourists[0].totalTourists,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
