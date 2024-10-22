const express = require('express');
const router = express.Router();
const DeletionRequest = require('../models/DeletionRequest.model');
router.use(express.json());

// Import each user model
const Tourist = require('../models/tourist.model');
const TourGuide = require('../models/tourGuide.model');
const Advertiser = require('../models/advertiser.model');
const Seller = require('../models/seller.model');
const Activity = require('../models/activity.model');
const Itinerary = require('../models/itinerary.model');


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

// Function to get all itinerary IDs
async function getAllItineraryIds() {
    try {
        // Query to fetch only the _id field from all itineraries
        const itineraryIds = await Itinerary.find({}, "_id").exec();

        // Extract just the ids from the result
        const ids = itineraryIds.map(itinerary => itinerary._id);

        console.log("Itinerary IDs:", ids);
        return ids;
    } catch (err) {
        console.error("Error fetching itinerary IDs:", err);
        return [];
    }
}

async function checkAllItinerariesByCreator(creatorUsername) {
    try {
        // Fetch all itinerary IDs
        const itineraryIds = await getAllItineraryIds();

        // Loop through each itinerary ID and check activities by the creator
        for (const itineraryId of itineraryIds) {
            const matchingActivities = await checkActivitiesByCreator(itineraryId, creatorUsername);
            if (matchingActivities.length > 0) {
                return true; // Found activities created by the user
            }
        }
        return false; // No matching activities found
    } catch (err) {
        console.error("Error in checking itineraries:", err);
        return false; // Return false on error to avoid blocking deletion
    }
}

/**
* Check if the user has booked any tourists in their itineraries.
* @param {String} userId - The ID of the user to check.
* @returns {Promise<Boolean>} - Returns true if touristsBooked is more than zero in any itinerary, otherwise false.
*/
async function hasTouristsBooked(userId) {
    try {
        // Find itineraries created by the specified user
        const itineraries = await Itinerary.find({ creator: userId });

        // Check if any itinerary has touristsBooked greater than zero
        for (const itinerary of itineraries) {
            if (itinerary.touristsBooked && itinerary.touristsBooked.length > 0) {
                return true; // Found an itinerary with tourists booked
            }
        }

        return false; // No itineraries with tourists booked found
    } catch (error) {
        console.error("Error checking tourists booked:", error);
        throw error; // Rethrow error for higher-level handling if necessary
    }
}

async function checkActivitiesByCreator(itineraryId, creatorUsername) {
    try {
        // Find the itinerary and populate activities
        const itinerary = await Itinerary.findById(itineraryId)
            .populate({
                path: "activities.activity", // Populates the activity field with Activity data
                model: "Activity", // Specify the model to populate from
            })
            .exec();

        if (!itinerary) {
            throw new Error("Itinerary not found");
        }

        // Check if any activity is created by the given creator username
        const matchingActivities = itinerary.activities.filter(
            (activityObj) => activityObj.activity && activityObj.activity.creator === creatorUsername
        );

        if (matchingActivities.length > 0) {
            console.log(`There are ${matchingActivities.length} activities created by ${creatorUsername}.`);
            return matchingActivities;
        } else {
            console.log(`No activities found for creator: ${creatorUsername}`);
            return [];
        }
    } catch (err) {
        console.error(err);
    }
}

async function hasBookingsByUsername(username) {
    try {
        // Find the tourist by their username
        const tourist = await Tourist.findOne({ username });

        // If the tourist is not found, return false
        if (!tourist) {
            return false;
        }

        // Check if the bookedItineraries array has any entries
        return tourist.bookedItineraries && tourist.bookedItineraries.length > 0;
    } catch (error) {
        console.error("Error checking bookings for tourist:", error);
        throw error; // Rethrow error for higher-level handling if necessary
    }
}


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
        let check1 = false;
        let check2 = false;
        let check3 = false;
        if (role.toLowerCase() === 'advertiser') {
            check1 = checkAllItinerariesByCreator(username);
            console.log(check1);
        }
        if (role.toLowerCase() == 'tourguide') {
            check2 = await hasTouristsBooked(username);

        }
        if (role.toLowerCase() == 'tourist') {
            check3 = await hasBookingsByUsername(username);

        }
        if (check1 || check2 || check3) {
            return res.status(400).json({ message: "Request can not be submitted." });
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
