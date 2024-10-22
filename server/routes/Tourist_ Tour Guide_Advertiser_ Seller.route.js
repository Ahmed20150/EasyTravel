const express = require('express');
const router = express.Router();
const DeletionRequest = require('../models/DeletionRequest.model');
router.use(express.json());

// Import each user model
const Tourist = require('../models/tourist.model');
const TourGuide = require('../models/tourGuide.model');
const Advertiser = require('../models/advertiser.model');
const Seller = require('../models/seller.model');

// Function to get the appropriate model based on role
const getUserModelByRole = (role) => {
    const role2 = role.toLowerCase();

    switch (role2) {
        case 'tourist':
            return Tourist;
        case 'tourguide':
            return TourGuide;
        case 'advertiser':
            return Advertiser;
        case 'seller':
            return Seller;
        default:
            return false;
    }
};

// Route to submit account deletion request based on username and role
router.post('/requestDelete/:username/:role', async (req, res) => {
    const { username, role } = req.params;

    try {
        // Get the correct user model based on the role
        const UserModel = getUserModelByRole(role);

        if (!UserModel) {
            return res.status(400).json({ message: "Invalid user role." });
        }

        // Find the user by username in the appropriate collection/model
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: `User with role ${role} not found.` });
        }
        // Check if a deletion request already exists for this user
        const alreadyRequested = await DeletionRequest.findOne({ username, role });
        if (alreadyRequested) {
            return res.status(400).json({ message: "Request already submitted." });
        }



        // Log the deletion request
        const deletionRequest = new DeletionRequest({
            username: user.username,
            role,
            requestDate: new Date(),
            status: 'Pending'
        });

        await deletionRequest.save();

        // Respond to the frontend with success message
        return res.status(200).json({ message: "Account deletion request submitted successfully." });
    }
    catch (error) {
        console.error("Error processing deletion request:", error); // Log the error
        return res.status(500).json({ message: "Internal Server Error." });
    }

});



module.exports = router;
