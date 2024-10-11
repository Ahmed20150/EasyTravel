const express = require("express");
const router = express.Router();
const Admin = require('../models/admin.model');
const TourismGoverner = require('../models/tourismGoverner.model');
router.use(express.json());

//Add Tourism Governer
router.post('/add-tourismGoverner', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password Required' });
    }

    try {
        const NonUniqueUser = await TourismGoverner.findOne({ username });
        if (NonUniqueUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const newTourismGoverner = new TourismGoverner({
            username,
            password
        });
        await newTourismGoverner.save();
        res.status(201).json({ message: 'Tourism Governer Added Successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error Creating new Tourism Governer Account', error });
    }
});


//Add Admin
router.post('/add-admin', async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password are required.' });
    }

    try {
        // Check if the username already exists
        const existingUser = await Admin.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists. Please choose a different one.' });
        }

        // Create a new Admin with the unique username
        const newAdmin = await Admin.create(req.body);

        // Save the new Admin to the database
        await newAdmin.save();

        // Return success message
        res.status(201).json({ message: 'Admin account added successfully.' });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'Error adding Admin account', error });
    }
});


module.exports = router;