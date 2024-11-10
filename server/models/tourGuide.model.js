const mongoose = require("mongoose");

const tourGuideSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    acceptedTerms: { 
        type: Boolean, 
        default: false }, //
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    mobileNumber:{
        type:Number,
        required:false,
        default: null
    },
    yearsOfExperience:{
        type:Number,
        required:false,
        default: null
    },
    previousWork:{
        type:String,
        required:false,
        default: null
    },
    firstTimeLogin: { 
        type: Number,
         default: 0
         },
    dateOfBirth:{
        type:Date,
        required:false,
        default: null
    },
    profilePicture: {
        type: String, // Store image as base64 string
        required: false
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
    firstTimeLogin: {  
        type: Boolean,
        default: true 
    },


});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema); //store in table "Tourist"

module.exports =  TourGuide; //export for use in other files