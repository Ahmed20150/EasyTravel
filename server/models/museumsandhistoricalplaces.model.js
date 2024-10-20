const mongoose = require("mongoose");

const actSchema  = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true
    },
    openingHours:{
        type:String,
        required:true
    },
    ticketPrice:{
        type:Number,
        required:true
        
    },
    picture:{
        type:String,
        required:false
    },

    numofpurchases:{type: Number, default: false}
});

const museumsandhistoricalplaces = mongoose.model("museumsandhistoricalplaces", actSchema); //store in table "Tourist"

module.exports =  museumsandhistoricalplaces; //export for use in other files