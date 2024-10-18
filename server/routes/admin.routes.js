const express = require("express");
const router = express.Router();
const Admin = require('../models/admin.model');
const TourismGoverner = require('../models/tourismGoverner.model');
const Tourist = require('../models/tourist.model')
const DeletionRequest = require('../models/DeletionRequest.model');
router.use(express.json());

//Add Tourism Governer
router.post('/add-tourismGoverner', async (req, res) => {
    const { username, password } = req.body;

      if(username.includes(" ")){
        return res.status(400).json({ message: 'Username is Invalid.' });
    }
      if(password.includes(" ")){
        return res.status(400).json({ message: 'Password is Invalid.' });
    }

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password Required' });
    }

    try {
        // Check if the username already exists (case-insensitive)
        const NonUniqueUser = await TourismGoverner.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
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
    if(username.includes(" ")){
        return res.status(400).json({ message: 'Username is Invalid.' });
    }
    if(password.includes(" ")){
        return res.status(400).json({ message: 'Password is Invalid.' });
    }

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password are required.' });
    }

    try {
        // Check if the username already exists
        const existingUser = await Admin.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
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


// Function to get the appropriate model based on role
const getUserModelByRole = (role) => {
    switch (role) {
        case 'Tourist':
            return Tourist;
        case 'TourGuide':
            return TourGuide;
        case 'Advertiser':
            return Advertiser;
        case 'Seller':
            return Seller;
        case 'Toursim Governer':
            return TourismGoverner;
        default:
            return Tourist;
    }
};

//Delete User
router.delete('/delete-user/:username/:role', async (req, res) => {
    const { username, role } = req.params;
    try {
        const UserModel = getUserModelByRole(role);

        if (!UserModel) {
            return res.status(400).json({ message: "Invalid user role." });
        }

        // Find the user by username in the appropriate collection/model
        // Find the user by _id and delete them
        const deletedUser = await UserModel.deleteOne({ username});

        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const request=await DeletionRequest.findOne({username,role})
        if(request){
            await DeletionRequest.deleteOne({username,role});
        }

        // Respond with success message
        return res.status(200).json({ message: "User deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting user:", error);
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
router.get('/viewAllUsers', async (req, res) => {
    try {
        // Fetch users from all models
        const tourists = await getAllUsersFromModel(Tourist);
        const governer = await getAllUsersFromModel(TourismGoverner);
        //const tourGuides = await getAllUsersFromModel(TourGuide);
        //const advertisers = await getAllUsersFromModel(Advertiser);
        //const sellers = await getAllUsersFromModel(Seller);

        // Combine users with specific fields into a single array
        const allUsers = [
            ...tourists.map(user => ({
                username: user.username,
                email: user.email,
                mobile_number: user.mobile_number,
                role: 'Tourist'
            })),
            ...governer.map(user => ({
                username: user.username,
                role: 'Toursim Governer'
            }))
            // ...tourGuides.map(user => ({
            //     username: user.username,
            //     email: user.email,
            //     mobile_number: user.mobile_number,
            //     role: 'TourGuide'
            // })),
            // ...advertisers.map(user => ({
            //     username: user.username,
            //     email: user.email,
            //     mobile_number: user.mobile_number,
            //     role: 'Advertiser'
            // })),
            // ...sellers.map(user => ({
            //     username: user.username,
            //     email: user.email,
            //     mobile_number: user.mobile_number,
            //     role: 'Seller'
            // }))
        ];

        // Return combined result
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching all users:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Route to view all users from all schemas
router.get('/viewRequests', async (req, res) => {
    try {
        // Fetch users from all models
        const Requests= await getAllUsersFromModel(DeletionRequest)
        //const tourGuides = await getAllUsersFromModel(TourGuide);
        //const advertisers = await getAllUsersFromModel(Advertiser);
        //const sellers = await getAllUsersFromModel(Seller);

        // Combine users with specific fields into a single array
        const allUsers = [
            ...Requests.map(user => ({
                username: user.username,
                email: user.email,
                mobile_number: user.mobile_number,
                role: 'Tourist'
            })),
            // ...governer.map(user => ({
            //     username: user.username,
            //     role: 'Toursim Governer'
            // }))
            // ...tourGuides.map(user => ({
            //     username: user.username,
            //     email: user.email,
            //     mobile_number: user.mobile_number,
            //     role: 'TourGuide'
            // })),
            // ...advertisers.map(user => ({
            //     username: user.username,
            //     email: user.email,
            //     mobile_number: user.mobile_number,
            //     role: 'Advertiser'
            // })),
            // ...sellers.map(user => ({
            //     username: user.username,
            //     email: user.email,
            //     mobile_number: user.mobile_number,
            //     role: 'Seller'
            // }))
        ];

        // Return combined result
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching all users:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


module.exports = router;