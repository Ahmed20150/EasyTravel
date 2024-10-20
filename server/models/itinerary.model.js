const mongoose = require("mongoose");
const activitySchema = require("./activity.model.js"); // Import the activitySchema

const itinerarySchema = new mongoose.Schema({
  activities: [
    {
      activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      }, // Reference to the Activity model
    },
  ],
  locationsToVisit: [String], // Array of location names or addresses
  timeline: { type: String, required: true },
  duration: { type: Number, required: true }, // Duration in hours
  languageOfTour: { type: String, required: true },
  priceOfTour: { type: Number, required: true },
  availableDates: [Date], // Array of available dates
  availableTimes: [String], // Array of available times
  accessibility: { type: String, required: true }, // Accessibility details
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  numofpurchases:{type: Number, default: 1},
    status: { 
        type: String, 
        enum: ['activated', 'deactivated'], 
        default: 'activated' 
    }
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;