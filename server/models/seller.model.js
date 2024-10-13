const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
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
    firstLastName: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    mobileNumber: {
        type: Number,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    profilePicture: {
        type: String, // Store image as base64 string
        required: false
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },

});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
