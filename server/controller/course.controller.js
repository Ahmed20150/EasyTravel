// backend/controllers/course.controller.js
const Course = require('../models/course.model');

// View all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

// Add a new course
const addCourse = async (req, res) => {
    const { code, name, department, maxCapacity } = req.body;

    if (!code || !name || !department || !maxCapacity) {
        return res.status(400).json({ message: 'All fields are mandatory' });
    }

    try {
        const unique=await Course.findOne({code})
        if(unique){
            return res.status(400).json({ message: 'Duplicate course code not allowed' });
        }
        const newCourse = new Course({ code, name, department, maxCapacity });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate course code not allowed' });
        }
        res.status(500).json({ message: 'Error adding course', error });
    }
};

// Modify the maxCapacity of a course
const updateMaxCapacity = async (req, res) => {
    const { code } = req.params;
    const { maxCapacity } = req.body;

    try {
        const course = await Course.findOneAndUpdate({ code }, { maxCapacity }, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error });
    }
};

// View the department of a course based on its code
const getDepartmentByCode = async (req, res) => {
    const { code } = req.params;

    try {
        const course = await Course.findOne({ code });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ department: course.department });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error });
    }
};

// Delete a course from the database
const deleteCourse = async (req, res) => {
    const { code } = req.params;

    try {
        const course = await Course.findOneAndDelete({ code });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error });
    }
};

module.exports = {
    getAllCourses,
    addCourse,
    updateMaxCapacity,
    getDepartmentByCode,
    deleteCourse,
};
