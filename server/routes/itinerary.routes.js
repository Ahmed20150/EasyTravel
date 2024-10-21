const express = require("express");
const router = express.Router();
const cors = require("cors");
const Itinerary = require("../models/itinerary.model.js");
router.use(express.json());
router.use(cors()); // This allows requests from any origin
//CREATE
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const newItinerary = new Itinerary(req.body);
    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while saving the itinerary." });
  }
});

// READ (Get all itineraries)
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json(itineraries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ (Get specific itinerary)
router.get("/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate(
      "activities.activity"
    ); // Populate activities for more details
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found." });
    }
    res.status(200).json(itinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
      // Run validators to ensure schema rules are met
    );
    if (!updatedItinerary) {
      return res.status(404).json({ error: "Itinerary not found." });
    }
    res.status(200).json(updatedItinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deletedItinerary) {
      return res.status(404).json({ error: "Itinerary not found." });
    }
    res.status(200).json({ message: "Itinerary deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { itineraryCounter } = req.body;
  console.log(` this is ${itineraryCounter} , and ${id} `);
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      { $set: { bookingCounter: itineraryCounter } },
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json(updatedItinerary);
  } catch (err) {
    console.error("Error updating bookingCounter:", err); // Print the error to the console
    res.status(500).json({ message: "Server error", error: err.message }); // Include the error message in the response
  }
});

module.exports = router;
