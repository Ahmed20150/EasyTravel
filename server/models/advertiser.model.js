const mongoose = require("mongoose");

const advertiserSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
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
    firstTimeLogin: { 
        type: Number,
         default: 0
         },
    previousWork:{
        type:String,
        required:false
    },
    dateOfBirth:{
        type:Date,
        required:false
    },
    acceptedTerms: { 
        type: Boolean, 
        default: false }, //new
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
});

const Advertiser = mongoose.model("Advertiser", advertiserSchema); //store in table "Tourist"

module.exports =  Advertiser; //export for use in other files