// backend/models/course.model.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
