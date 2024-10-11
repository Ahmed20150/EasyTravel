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
});

const MuseumsAndHistoricalPlaces = mongoose.model(
  "MuseumsAndHistoricalPlaces",
  museumsAndHistoricalPlacesSchema
); //store in table "MuseumsAndHistoricalPlaces"

module.exports = MuseumsAndHistoricalPlaces; //export for use in other files
