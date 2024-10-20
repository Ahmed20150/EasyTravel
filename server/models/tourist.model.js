const mongoose = require("mongoose");


const touristSchema = new mongoose.Schema({
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
    mobileNumber:{
        type:Number,
        required:true
    },
    wallet: {
        type: Number,
        default: 0 
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
    //TODO TOURIST DOES NOT HAVE TERMS AND CONDITIONS 
    firstTimeLogin: {  
        type: Boolean,
        default: true 
    },

});

const Tourist = mongoose.model("Tourist", touristSchema); //store in table "Tourist"

module.exports = Tourist; //export for use in other files