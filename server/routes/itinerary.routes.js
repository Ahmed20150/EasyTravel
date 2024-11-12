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
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).send({ errors });
    }
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).send({ errors });
    }
    res.status(500).json({ error: error.message });
  }
});

router.put("/toggleActivation/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).send("Itinerary not found");
    }

    // Toggle the 'activated' status
    itinerary.activated = !itinerary.activated;
    await itinerary.save();
    res.send(itinerary);
  } catch (error) {
    res.status(500).send("Error toggling activation status");
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
router.patch("/:id/touristsBook", async (req, res) => {
  try {
    const { id } = req.params;
    const { touristsBooked } = req.body; // Update this to handle the array correctly

    const updatedBookingList = await Itinerary.findByIdAndUpdate(
      id, // Use the correct identifier for MongoDB
      { touristsBooked: touristsBooked }, // Update bookedItineraries array
      { new: true } // Return the updated document
    );

    if (!updatedBookingList) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json({
      message: "Itinerary booked successfully",
      touristsBooked: updatedBookingList.touristsBooked,
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// deactivate all itineraries by username
router.put("/deactivateAll/:username", async (req, res) => {
  try {
    const username = req.params.username;
    console.log(`Deactivating itineraries for username: ${username}`);

    const result = await Itinerary.updateMany(
      { creator: req.params.username },
      { $set: { activated: false } }
    );
    console.log(`Update result: ${JSON.stringify(result)}`);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "All itineraries deactivated" });
    } else {
      res.status(404).json({ message: "No itineraries found for the given username" });
    }
  } catch (err) {
    console.error("Error deactivating itineraries:", err);
    res.status(500).json({ error: err.message });
  }
});


// delete all itinraries by username
router.delete("/deleteAll/:username", async (req, res) => {
  try {
    await Itinerary.deleteMany({ creator: req.params.username });
    res.status(200).json({ message: "All Itineraries deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/increment-purchases/:itineraryId', async (req, res) => {
  try {
    const { itineraryId } = req.params;

    // Fetch the itinerary by ID
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Iterate through the list of activity IDs and increment numOfPurchases
    const activityUpdates = itinerary.activities.map(async (activityId) => {
      const activity = await Activity.findById(activityId);
      if (activity) {
        activity.numOfPurchases += 1;
        await activity.save();
      }
    });

    // Wait for all updates to complete
    await Promise.all(activityUpdates);

    res.status(200).json({ message: 'numOfPurchases incremented for all activities in the itinerary' });
  } catch (error) {
    console.error('Error incrementing numOfPurchases:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
