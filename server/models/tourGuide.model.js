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
});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema); //store in table "Tourist"

module.exports =  TourGuide; //export for use in other files