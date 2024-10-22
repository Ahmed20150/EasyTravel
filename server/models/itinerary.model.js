const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  creator: {
    type: String,
  },
  activities: [
    {
      activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: [true, "An activity reference is required"], // Custom error message
      },
    },
  ],
  locationsToVisit: {
    type: [String],
    validate: {
      validator: (v) => v.every((location) => typeof location === "string"), // Ensure all locations are strings
      message: "All locations must be strings", // Custom error message
    },
  },
  timeline: {
    type: String,
    required: [true, "A timeline is required"], // Custom error message
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
      message: "Timeline must be a string", // Custom error message
    },
  },
  duration: {
    type: Number,
    required: [true, "A duration is required"], // Custom error message
    min: [1, "Duration cannot be less than 1 hour"], // Custom error message for negative values
  },
  languageOfTour: {
    type: String,
    required: [true, "A language of tour is required"], // Custom error message
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
      message: "Language of tour must be a string", // Custom error message
    },
  },
  priceOfTour: {
    type: Number,
    required: [true, "A price for the tour is required"], // Custom error message
    min: [0, "Price cannot be negative"], // Custom error message for negative values
  },
  availableDates: {
    type: [Date],
    validate: {
      validator: (v) => v.every((date) => date instanceof Date), // Ensure all dates are valid Date objects
      message: "All available dates must be valid Date objects", // Custom error message
    },
  },
  availableTimes: {
    type: [String],
    validate: {
      validator: (v) => v.every((time) => typeof time === "string"), // Ensure all times are strings
      message: "All available times must be strings", // Custom error message
    },
  },
  accessibility: {
    type: String,
    required: [true, "Accessibility information is required"], // Custom error message
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
      message: "Accessibility must be a string", // Custom error message
    },
  },
  pickupLocation: {
    type: String,
    required: [true, "A pickup location is required"], // Custom error message
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
      message: "Pickup location must be a string", // Custom error message
    },
  },
  dropoffLocation: {
    type: String,
    required: [true, "A dropoff location is required"], // Custom error message
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
      message: "Dropoff location must be a string", // Custom error message
    },
  },
  touristsBooked: { type: [String] },
  activated: { type: Boolean, default: true },
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;
