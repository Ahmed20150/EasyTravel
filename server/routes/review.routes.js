const express = require("express");
const mongoose = require("mongoose");
const TourGuide = require("../models/tourGuide.model");
const Itinerary = require("../models/itinerary.model"); // Assuming Itinerary model is defined similarly to TourGuide
const Activity = require("../models/activity.model"); // Assuming Activity model is defined similarly to TourGuide
const router = express.Router();


// Function to get the appropriate model based on role
const getModel = (role) => {
    const role2 = role.toLowerCase();

    switch (role2) {
        case 'tourguide':
            return TourGuide;
        case 'activity':
            return Activity;
        case 'itinerary':
            return Itinerary;
        default:
            return false;
    }
};

// Route to create a new review
router.post("/create", async (req, res) => {
    const { type, id, rating, comment } = req.body;

    if (!type || !id || !rating || !comment) {
        return res.status(400).json({ error: "Missing type, id, rating, or comment" });
    }

    const Model = getModel(type);
    if (!Model) {
        return res.status(400).json({ error: "Invalid type specified" });
    }

    try {
        
        
        const item = await Model.findById(id);
        if (!item) {
            return res.status(404).json({ error: `${type} not found` });
        }

        // Create a new review
        await item.createReview(rating, comment);
        await item.save();

        res.status(200).json({ message: "Review created successfully", item });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
