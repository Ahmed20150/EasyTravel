const mongoose = require("mongoose");

const acttSchema  = new mongoose.Schema({
    time: {
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
});

const Actt = mongoose.model("Actt", acttSchema); //store in table "Tourist"

module.exports =  Actt; //export for use in other files