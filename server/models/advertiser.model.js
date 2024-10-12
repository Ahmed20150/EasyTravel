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
    accepted:{
        type: Boolean,
        default:false
    },
});

const Advertiser = mongoose.model("Advertiser", advertiserSchema); //store in table "Tourist"

module.exports =  Advertiser; //export for use in other files