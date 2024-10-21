const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Historic Areas', 'Beaches', 'Family-friendly', 'Shopping', 'Budget-friendly']
    }
});

const Preference = mongoose.model("Preference", preferenceSchema); 

module.exports = Preference;
