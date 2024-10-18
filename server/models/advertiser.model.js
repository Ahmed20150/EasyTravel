const mongoose = require("mongoose");

const advertiserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: Number,
      required: false
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    companyName: {
      type: String,
      required: false
    },
    website: {
      type: String,
      required: false
    },
    hotline: {
      type: String,
      required: false
    },
    companyProfile: {
      type: String, // Store PDF as base64 string
      required: false
    },
    profilePicture: {
      type: String, // Store image as base64 string
      required: false
    },
    status: {
      type: String,
      enum: ['accepted', 'rejected', 'pending'],
      default: 'pending'
    }
  });  

const Advertiser = mongoose.model("Advertiser", advertiserSchema); //store in table "Tourist"

module.exports =  Advertiser; //export for use in other files