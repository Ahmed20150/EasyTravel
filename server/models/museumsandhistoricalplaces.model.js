const mongoose = require("mongoose");

const museumsAndHistoricalPlacesSchema = new mongoose.Schema({
  type:{
    type: String,
    required: true,
    enum: ["foreigner", "native", "student"],
    default: "foreigner"
  },

  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  ticketPrices: {
    foreigner: {
      type: Number,
      required: true,
    },
    native: {
      type: Number,
      required: true,
    },
    student: {
      type: Number,
      required: true,
    },
  },
  picture: {
    type: String,
  }, // Optional field for picture

  numofpurchases:{type: Number, default: 1},

  tags: [
    {
      type: String, // e.g., Monuments, Museums, Religious Sites, Palaces/Castles
    },
  ],
});

const MuseumsAndHistoricalPlaces = mongoose.model(
  "MuseumsAndHistoricalPlaces",
  museumsAndHistoricalPlacesSchema
);

module.exports = MuseumsAndHistoricalPlaces;