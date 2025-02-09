const express = require("express");
const router = express.Router();
router.use(express.json());
const cors = require("cors");
router.use(cors());
const Museum = require("../models/museumsAndHistoricalPlaces.model.js");

// Create a new museum entry
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      openingHours,
      ticketPrices,
      picture,
      tags,
      creator, // Add creator field here
    } = req.body;

    // Ensure all required fields, including creator, are filled
    if (
      !name ||
      !description ||
      !location ||
      !openingHours.from ||
      !openingHours.to ||
      !ticketPrices ||
      !creator
    ) {
      return res.status(400).json({
        message: "All required fields must be filled, including creator.",
      });
    }

    const existingMuseum = await Museum.findOne({ name });
    if (existingMuseum) {
      return res
        .status(400)
        .json({ message: "A museum with this name already exists." });
    }

    const museum = await Museum.create({
      name,
      description,
      location,
      openingHours,
      ticketPrices,
      picture: picture || "",
      tags: tags || [],
      creator, // Add the creator here
    });

    res.status(201).json(museum);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all museums
router.get("/", async (req, res) => {
  try {
    const museums = await Museum.find({});
    res.status(200).json(museums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single museum by ID
router.get("/:id", async (req, res) => {
  try {
    const museum = await Museum.findById(req.params.id);
    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json(museum);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a museum by ID
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      openingHours,
      ticketPrices,
      picture,
      tags,
    } = req.body;

    // Ensure openingHours has both 'from' and 'to' values
    if (
      !name ||
      !description ||
      !location ||
      !openingHours.from ||
      !openingHours.to ||
      !ticketPrices
    ) {
      return res.status(400).json({
        message: "All required fields must be filled, including opening hours.",
      });
    }

    const existingMuseumByName = await Museum.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingMuseumByName) {
      return res
        .status(400)
        .json({ message: "A museum with this name already exists." });
    }

    const updatedData = {
      name,
      description,
      location,
      openingHours, // Update 'from' and 'to' times
      ticketPrices, // Update prices
      picture: picture || "",
      tags: tags || [], // Update tags
    };

    const museum = await Museum.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    res.status(200).json(museum);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a museum by ID
router.delete("/:id", async (req, res) => {
  try {
    const museum = await Museum.findByIdAndDelete(req.params.id);
    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json({ message: "Museum deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
