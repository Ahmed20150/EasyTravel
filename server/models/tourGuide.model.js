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
    password:{
        type:String,
        required:true
    },
    //TODO change to string accepted, pending, rejected
    accepted:{
        type: Boolean,
        default:false
    },
});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema); //store in table "Tourist"

module.exports =  TourGuide; //export for use in other files