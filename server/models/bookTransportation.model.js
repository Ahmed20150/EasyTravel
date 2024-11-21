const mongoose = require("mongoose");

const transportationSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true
    },
    advertiser: {
      type: String,
      required: true
    },
    departureLocation: {
      type: String,
      required: true
    },
    arrivalLocation: {
      type: String,
      required: false
    },
    departureDate: {
      type: Date,
      required: false
    },
    arrivalDate: {
      type: Date,
      required: false
    },
    NoPassengers: {
      type: Number,
      required: false
    },
    bookingStatus: {
      type: String,
      required: false
    },
    price: {
      type: Number, // Store PDF as base64 string
      required: false
    },
    tourist: {
      type: String, // Store image as base64 string
      required: false
    },

  });  

const Tranportation = mongoose.model("transportation", transportationSchema); //store in table "Tourist"

module.exports =  Tranportation; //export for use in other files