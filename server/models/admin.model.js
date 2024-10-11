const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model("Admin", adminSchema); //store in table "Admin"

module.exports = Admin; //export for use in other files