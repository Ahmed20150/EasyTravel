const mongoose = require("mongoose");

const toursimGovernerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        default: "tourismGoverner",
    }
});

const TourismGoverner = mongoose.model("TourismGoverner", toursimGovernerSchema); //store in table "TourismGoverner"

module.exports = TourismGoverner; //export for use in other files