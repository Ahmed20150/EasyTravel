const mongoose = require("mongoose");
const Itinerary = require("./itinerary.model");

const touristSchema = new mongoose.Schema({
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
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" }], 
});

const Tourist = mongoose.model("Tourist", touristSchema); //store in table "Tourist"

module.exports = Tourist; //export for use in other files
