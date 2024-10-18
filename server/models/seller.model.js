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
    acceptedTerms: { 
        type: Boolean, 
        default: false },
    previousWork:{
        type:String,
        required:false
    },
    dateOfBirth:{
        type:Date,
        required:false
    },
    firstTimeLogin: { 
        type: Number,
         default: 0
         },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
    // id: fileSchema,
    // taxCard: fileSchema,
});

const Seller = mongoose.model("Seller", sellerSchema); //store in table "Tourist"

module.exports =  Seller; //export for use in other files