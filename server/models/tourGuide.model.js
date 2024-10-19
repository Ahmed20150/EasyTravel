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
    firstTimeLogin: {  //used to determine if terms & conditions will be displayed & if user will be redirected to change password
        type: Number,
        default: 0 //Possible values: 0 (account pending), -1(account rejected),
                    //1 (account accepted, but has not accepted terms), 2 (account accepted and terms accepted (first time login)),
                    //3 (Regular User (Not first time Login))
    },

});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema); //store in table "Tourist"

module.exports =  TourGuide; //export for use in other files