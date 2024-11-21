const express = require("express");
const router = express.Router();
const Itinerary = require("../models/itinerary.model"); // Assuming you have an Itinerary model
const Activity = require("../models/activity.model"); // Assuming you have an Activity model
const Museum = require("../models/museumsAndHistoricalPlaces.model"); // Assuming you have a Museum model

// Search for museums, historical places, activities, or itineraries by name, category, or tag
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Search for itineraries, activities, and museums by name, category, or tag
    const itineraryResults = await Itinerary.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    const activityResults = await Activity.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    const museumResults = await Museum.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    const results = [...itineraryResults, ...activityResults, ...museumResults];

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching for items:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;