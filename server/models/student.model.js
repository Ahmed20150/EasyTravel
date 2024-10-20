const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    GPA: {
        type: Number,
        required: true
    },
});

const Student = mongoose.model("Student", StudentSchema); //store in table "Tourist"

module.exports = Student; //export for use in other files