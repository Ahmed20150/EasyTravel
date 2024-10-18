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
        required:false
    },
    yearsOfExperience:{
        type:Number,
        required:false
    },
    previousWork:{
        type:String,
        required:false
    },
    firstTimeLogin: { 
        type: Number,
         default: 0
         },
    dateOfBirth:{
        type:Date,
        required:false
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema); //store in table "Tourist"

module.exports =  TourGuide; //export for use in other files