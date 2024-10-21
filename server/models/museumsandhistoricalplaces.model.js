const mongoose = require("mongoose");

const museumsAndHistoricalPlacesSchema = new mongoose.Schema({
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
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
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
  tags: [
    {
      type: String, // e.g., Monuments, Museums, Religious Sites, Palaces/Castles
    },
  ],
  numofpurchases:{type: Number, default: 1},
});

const MuseumsAndHistoricalPlaces = mongoose.model(
  "MuseumsAndHistoricalPlaces",
  museumsAndHistoricalPlacesSchema
);

module.exports = MuseumsAndHistoricalPlaces;