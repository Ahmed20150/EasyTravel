const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    touristUsername: {
      type: String,
      required: true
    },
    itineraryId: {
      type: String,
      required: true
    },
    bookingDate: {
      type: Date,
      required: true
    },
    bookingTime: {
      type: String,
      required: true
    },
  });  

const Booking = mongoose.model("Booking", bookingSchema); 

module.exports = Booking;