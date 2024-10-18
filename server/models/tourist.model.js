const mongoose = require("mongoose");


const touristSchema = new mongoose.Schema({
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
    mobileNumber:{
        type:Number,
        required:true
    },
    wallet: {
        type: Number,
        default: 0 // Set default value to 0 for the wallet
    },
    nationality:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:Date,
        required:true
    },
    occupation:{ // TODO enum?
        type:String,
        required:true
    }, 
    firstTimeLogin: { 
        type: Number,
         default: 0
         },

});

const Tourist = mongoose.model("Tourist", touristSchema); //store in table "Tourist"

module.exports =  Tourist; //export for use in other files