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
    acceptedTerms: { 
        type: Boolean, 
        default: false }, //new
    status: {
      type: String,
      enum: ['accepted', 'rejected', 'pending'],
      default: 'pending'
    },
    firstTimeLogin: {  //used to determine if terms & conditions will be displayed & if user will be redirected to change password
        type: Number,
        default: 0 //Possible values: 0 (account pending), -1(account rejected),
                    //1 (account accepted, but has not accepted terms), 2 (account accepted and terms accepted (first time login)),
                    //3 (Regular User (Not first time Login))
    },

  });  

const Advertiser = mongoose.model("Advertiser", advertiserSchema); //store in table "Tourist"

module.exports =  Advertiser; //export for use in other files