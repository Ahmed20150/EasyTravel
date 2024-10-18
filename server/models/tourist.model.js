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
    mobile_number: {
        type: Number,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    occupation: { //enum?
        type: String,
        required: true
    },
});

const Tourist = mongoose.model("Tourist", touristSchema); //store in table "Tourist"

module.exports = Tourist; //export for use in other files