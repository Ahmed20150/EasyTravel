const express = require("express");
const router = express.Router();
const Student = require('../models/student.model');
const mongoose = require('mongoose'); // Ensure mongoose is required
router.use(express.json());

//Add Studnent
router.post('/add-student', async (req, res) => {
    const { id, firstname, lastname, major, GPA } = req.body;

    if (firstname.includes(" ")) {
        return res.status(400).json({ message: 'firstname is Invalid.' });
    }
    if (lastname.includes(" ")) {
        return res.status(400).json({ message: 'lastname is Invalid.' });
    }
    if (GPA > 5 || GPA < 0.7) {
        return res.status(400).json({ message: 'GPA is Invalid.' });
    }

    if (!firstname || !lastname || !GPA || !major || !id) {
        return res.status(400).json({ message: 'Missing Input' });
    }


    try {
        // Check if the username already exists (case-insensitive)
        const NonUniqueUser = await Student.findOne({ id });
        if (NonUniqueUser) {
            return res.status(400).json({ message: 'id already exists' });
        }
        const newStudent = new Student({
            id,
            firstname,
            lastname,
            major,
            GPA
        });
        await newStudent.save();
        res.status(201).json({ message: 'Student Added Successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error Creating new Student Account', error });
    }
});



//Delete User
router.delete('/delete-student', async (req, res) => {
    const { id } = req.body;
    try {
        // Find the user by username in the appropriate collection/model
        // Find the user by _id and delete them

        const deletedUser = await Student.deleteOne({ id });

        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Respond with success message
        return res.status(200).json({ message: "Student Account deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting Student Account:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Function to get all users from a specific model
const getAllUsersFromModel = async (UserModel) => {
    try {
        return await UserModel.find({});
    } catch (error) {
        console.error(`Error fetching users from ${UserModel.modelName}:`, error);
        return [];
    }
};

// Route to view all users from all schemas
router.get('/view-student', async (req, res) => {
    try {
        // Fetch users from all models
        const students = await getAllUsersFromModel(Student);

        // Combine users with specific fields into a single array
        const allUsers = [
            ...students.map(user => ({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                major: user.major,
                GPA: user.GPA
            })),
        ];

        // Return combined result
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching all users:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// UPDATE
router.put('/update-student', async (req, res) => {
    const { id, firstname, lastname, major, GPA } = req.body;

    // Validation for input fields
    if (!id || !firstname || !lastname || !major || !GPA) {
        return res.status(400).json({ message: 'Missing Input' });
    }
    if (firstname.includes(" ")) {
        return res.status(400).json({ message: 'First name is invalid.' });
    }
    if (lastname.includes(" ")) {
        return res.status(400).json({ message: 'Last name is invalid.' });
    }
    if (GPA > 5 || GPA < 0.7) {
        return res.status(400).json({ message: 'GPA is invalid.' });
    }

    try {
        // Use findOneAndUpdate to update the student by custom `id` field
        const student = await Student.findOneAndUpdate(
            { id }, // Search by custom `id`
            { firstname, lastname, major, GPA }, // Update data
            { new: true, runValidators: true } // Return updated document and run validation
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ message: 'Error updating student', error });
    }
});

module.exports = router;