const mongoose = require("mongoose");
const Itinerary = require("./itinerary.model");
const Preference = require("./preference.model");

const touristSchema = new mongoose.Schema(
  {
    wishlist: { type: [String], default: [] }, // Array to store wishlist item IDs or names
    
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    nationality: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    firstTimeLogin: {
      type: Boolean,
      default: true,
    },
    bookedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    BookedFlights: [{ type: String }],
    BookedHotels: [{ type: String }],
    preferences: [
      {
        type: String, // Store the names of preferences directly
      },
    ],
    bookmarkedEvents: { type: [String], default: [] }, // Array to store event IDs
  },
  { timestamps: true }
);


const Tourist = mongoose.model("Tourist", touristSchema); //store in table "Tourist"

module.exports = Tourist; //export for use in other files
