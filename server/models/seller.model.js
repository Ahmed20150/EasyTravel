const mongoose = require("mongoose");
const fileSchema = require("./file.model");

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
    previousWork:{
        type:String,
        required:false
    },
    dateOfBirth:{
        type:Date,
        required:false
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
    file: {
        type: String, // store the file path or URL as a string
        required: false
    },
    // id: fileSchema,
    // taxCard: fileSchema,
});

const Seller = mongoose.model("Seller", sellerSchema); //store in table "Tourist"

module.exports =  Seller; //export for use in other files