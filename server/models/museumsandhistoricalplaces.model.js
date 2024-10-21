const mongoose = require('mongoose');

const museumsAndHistoricalPlacesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
  }, // Optional field for picture
  tags: [
    {
      type: String, // e.g., Monuments, Museums, Religious Sites, Palaces/Castles
    },
  ],
  numofpurchases: {
    type: Number,
    default: 1,
  },
});

const MuseumsAndHistoricalPlaces = mongoose.model(
  'MuseumsAndHistoricalPlaces',
  museumsAndHistoricalPlacesSchema
);

module.exports = MuseumsAndHistoricalPlaces;