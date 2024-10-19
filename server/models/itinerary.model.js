const mongoose = require("mongoose");
const activitySchema = require("./activity.model.js"); // Import the activitySchema

const itinerarySchema = new mongoose.Schema({
  activities: [
    {
      activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true, // Ensure that an activity reference is provided
      },
    },
  ],
  locationsToVisit: {
    type: [String],
    validate: {
      validator: (v) => v.every((location) => typeof location === "string"), // Ensure all locations are strings
    },
  },
  timeline: {
    type: String,
    required: true,
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
    },
  },
  duration: {
    type: Number,
    required: true,
    min: 0, // Duration cannot be negative
  },
  languageOfTour: {
    type: String,
    required: true,
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
    },
  },
  priceOfTour: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
  availableDates: {
    type: [Date],
    validate: {
      validator: (v) => v.every((date) => date instanceof Date), // Ensure all dates are valid Date objects
    },
  },
  availableTimes: {
    type: [String],
    validate: {
      validator: (v) => v.every((time) => typeof time === "string"), // Ensure all times are strings
    },
  },
  accessibility: {
    type: String,
    required: true,
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
    },
  },
  pickupLocation: {
    type: String,
    required: true,
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
    },
  },
  dropoffLocation: {
    type: String,
    required: true,
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
    },
  },
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;
