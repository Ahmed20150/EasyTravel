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
    //TODO TOURIST DOES NOT ACCEPT TERMS AND CONDITIONS (so he doesnt have value 1) (from 0 -> 2 -> 3)
    firstTimeLogin: {  //used to determine if terms & conditions will be displayed & if user will be redirected to change password
        type: Number,
        default: 0 //Possible values: 0 (account pending), -1(account rejected),
                    //1 (account accepted, but has not accepted terms), 2 (account accepted and terms accepted (first time login)),
                    //3 (Regular User (Not first time Login))
    },

});

const Tourist = mongoose.model("Tourist", touristSchema); //store in table "Tourist"

module.exports =  Tourist; //export for use in other files