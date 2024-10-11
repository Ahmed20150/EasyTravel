const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
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

const Seller = mongoose.model("Seller", sellerSchema); //store in table "Tourist"

module.exports =  Seller; //export for use in other files