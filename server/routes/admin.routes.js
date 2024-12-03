const express = require("express");
const router = express.Router();
const Admin = require('../models/admin.model');
const TourGuide = require('../models/tourGuide.model');
const Advertiser = require('../models/advertiser.model');
const Seller = require('../models/seller.model');
const TourismGoverner = require('../models/tourismGoverner.model');
const bcrypt = require('bcrypt');
const Tourist = require('../models/tourist.model')
const DeletionRequest = require('../models/DeletionRequest.model');
const GiftItem = require('../models/giftitem.model'); // Adjust the path as per your file structure
router.use(express.json());



// Admin: Add a new gift item with its details, price, and available quantity
router.post('/addGiftItem', async (req, res) => {
    const { name, image, description, price, purchases,quantity, date, seller} = req.body;

    try {
        // Creating a new GiftItem with purchases and date fields included
        const newGiftItem = new GiftItem({
            name,
            image,
            description,
            price,
            purchases: purchases || 0,  // Defaults to 0 if not provided
            quantity,
            date,
            seller,
        });

        await newGiftItem.save();
        res.status(201).json({ message: 'Gift item added successfully', newGiftItem });
    } catch (error) {
        res.status(500).json({ message: 'Error adding gift item', error });
    }
});

// Admin: Update an existing gift item
router.put('/updateGiftItem/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image, description, price, purchases,quantity, date,seller } = req.body;

    try {
        const updatedGiftItem = await GiftItem.findByIdAndUpdate(
            id,
            { name, image, description, price, purchases,quantity, date,seller },
            { new: true }
        );

        if (!updatedGiftItem) {
            return res.status(404).json({ message: 'Gift item not found' });
        }

        res.status(200).json({ message: 'Gift item updated successfully', updatedGiftItem });
    } catch (error) {
        res.status(500).json({ message: 'Error updating gift item', error });
    }
});

// Admin: Delete a gift item
router.delete('/deleteGiftItem/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedGiftItem = await GiftItem.findByIdAndDelete(id);

        if (!deletedGiftItem) {
            return res.status(404).json({ message: 'Gift item not found' });
        }
        res.status(200).json({ message: 'Gift item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting gift item', error });
    }
});


// Add Tourism Governer
router.post('/add-tourismGoverner', async (req, res) => {
    const { username, password } = req.body;

    if (username.includes(" ")) {
        return res.status(400).json({ message: 'Username is Invalid.' });
    }
    if (password.includes(" ")) {
        return res.status(400).json({ message: 'Password is Invalid.' });
    }

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password Required' });
    }

    check1 = await Tourist.findOne({ username });
    check2 = await Advertiser.findOne({ username });
    check3 = await Seller.findOne({ username });
    check4 = await TourGuide.findOne({ username });
    check4 = await Admin.findOne({ username });
    if (check1 || check2 || check3 || check4) {
        return res.status(400).json({ message: 'Username already exists in database. Please choose a different one.' });
    }

    try {
        // Check if the username already exists (case-insensitive)
        const NonUniqueUser = await TourismGoverner.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if (NonUniqueUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newTourismGoverner = new TourismGoverner({
            username,
            password,
        });

        await newTourismGoverner.save();
        res.status(201).json({ message: 'Tourism Governer Added Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error Creating new Tourism Governer Account', error });
    }
});

// Add Admin
router.post('/add-admin', async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (username.includes(" ")) {
        return res.status(400).json({ message: 'Username is Invalid.' });
    }
    if (password.includes(" ")) {
        return res.status(400).json({ message: 'Password is Invalid.' });
    }

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password are required.' });
    }

    check1 = await Tourist.findOne({ username });
    check2 = await Advertiser.findOne({ username });
    check3 = await Seller.findOne({ username });
    check4 = await TourGuide.findOne({ username });
    check4 = await TourismGoverner.findOne({ username });
    if (check1 || check2 || check3 || check4) {
        return res.status(400).json({ message: 'Username already exists in database. Please choose a different one.' });
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
        case 'toursim governer':
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
        const deletedUser = await UserModel.deleteOne({ username });

        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const request = await DeletionRequest.findOne({ username, role })
        if (request) {
            await DeletionRequest.deleteOne({ username, role });
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
        const tourGuides = await getAllUsersFromModel(TourGuide);
        const advertisers = await getAllUsersFromModel(Advertiser);
        const sellers = await getAllUsersFromModel(Seller);


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
            })),
            ...tourGuides.map(user => ({
                username: user.username,
                email: user.email,
                mobile_number: user.mobile_number,
                role: 'TourGuide'
            })),
            ...advertisers.map(user => ({
                username: user.username,
                email: user.email,
                mobile_number: user.mobile_number,
                role: 'Advertiser'
            })),
            ...sellers.map(user => ({
                username: user.username,
                email: user.email,
                mobile_number: user.mobile_number,
                role: 'Seller'
            }))
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
        const Requests = await getAllUsersFromModel(DeletionRequest)

        // Combine users with specific fields into a single array
        const allUsers = [
            ...Requests.map(user => ({
                username: user.username,
                email: user.email,
                mobile_number: user.mobile_number,
                role: user.role
            })),
        ];

        // Return combined result
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching all users:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Function to get pending requests
const getPendingRequests = async (Model) => {
    try {
        return await Model.find({ status: 'pending' });
    } catch (error) {
        throw new Error('Error fetching pending requests');
    }
};

// Endpoint to get pending tour guide requests
router.get('/pending-tour-guides', async (req, res) => {
    try {
        const pendingGuides = await getPendingRequests(TourGuide);
        res.status(200).json(pendingGuides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending tour guides', error: error.message });
    }
});

// Endpoint to get pending advertiser requests
router.get('/pending-advertisers', async (req, res) => {
    try {
        const pendingAdvertisers = await getPendingRequests(Advertiser);
        res.status(200).json(pendingAdvertisers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending advertisers', error: error.message });
    }
});

// Endpoint to get pending seller requests
router.get('/pending-sellers', async (req, res) => {
    try {
        const pendingSellers = await getPendingRequests(Seller);
        res.status(200).json(pendingSellers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending sellers', error: error.message });
    }
});

// Generic function to accept or reject requests
const updateStatus = async (Model, id, status) => {
    try {
        let update = { status };
        if (status === 'accepted') {
            update.firstTimeLogin = 1; // Set firstTimeLogin to 1 when accepted
        }
        const updatedDocument = await Model.findByIdAndUpdate(id, update, { new: true });
        if (!updatedDocument) {
            throw new Error('Document not found');
        }
        return updatedDocument;
    } catch (error) {
        throw new Error('Error updating status');
    }
};


// Endpoint to accept a tour guide
router.put('/accept-tour-guide/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedGuide = await updateStatus(TourGuide, id, 'accepted');
        res.status(200).json({ message: 'Tour guide accepted', data: updatedGuide });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Endpoint to reject a tour guide
router.put('/reject-tour-guide/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedGuide = await updateStatus(TourGuide, id, 'rejected');
        res.status(200).json({ message: 'Tour guide rejected', data: updatedGuide });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Endpoint to accept an advertiser
router.put('/accept-advertiser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAdvertiser = await updateStatus(Advertiser, id, 'accepted');
        res.status(200).json({ message: 'Advertiser accepted', data: updatedAdvertiser });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Endpoint to reject an advertiser
router.put('/reject-advertiser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAdvertiser = await updateStatus(Advertiser, id, 'rejected');
        res.status(200).json({ message: 'Advertiser rejected', data: updatedAdvertiser });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Endpoint to accept a seller
router.put('/accept-seller/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSeller = await updateStatus(Seller, id, 'accepted');
        res.status(200).json({ message: 'Seller accepted', data: updatedSeller });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Endpoint to reject a seller
router.put('/reject-seller/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSeller = await updateStatus(Seller, id, 'rejected');
        res.status(200).json({ message: 'Seller rejected', data: updatedSeller });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Endpoint to accept terms for Tour Guides
router.put('/tourGuide/:id/accept-terms', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedGuide = await TourGuide.findByIdAndUpdate(
            id,
            { firstTimeLogin: false, acceptedTerms: true },
            { new: true });
        if (!updatedGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        res.status(200).json({ message: 'Terms accepted for tour guide', data: updatedGuide });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting terms for tour guide', error: error.message });
    }
});

// Endpoint to accept terms for Advertisers
router.put('/advertiser/:id/accept-terms', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAdvertiser = await Advertiser.findByIdAndUpdate(id,
            { firstTimeLogin: false, acceptedTerms: true },
            { new: true });
        if (!updatedAdvertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }
        res.status(200).json({ message: 'Terms accepted for advertiser', data: updatedAdvertiser });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting terms for advertiser', error: error.message });
    }
});

// Endpoint to accept terms for Sellers
router.put('/seller/:id/accept-terms', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSeller = await Seller.findByIdAndUpdate(id,
            { firstTimeLogin: false, acceptedTerms: true },
            { new: true });
        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json({ message: 'Terms accepted for seller', data: updatedSeller });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting terms for seller', error: error.message });
    }
});


/////////////////////////// 

  
  
//////////////



// // Helper function to count new users grouped by month and year
// const countNewUsersGroupedByMonth = async (Model) => {
//     const result = await Model.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $sort: { "_id.year": -1, "_id.month": -1 } // Sort by year and month descending
//       }
//     ]);
//     return result;
//   };
  
//   // Admin Route to get user statistics
//   router.get('/stats', async (req, res) => {
//     try {
//       // Get new users grouped by month for each role (excluding Admins)
//       const touristsByMonth = await countNewUsersGroupedByMonth(Tourist);
//       const sellersByMonth = await countNewUsersGroupedByMonth(Seller);
//       const advertisersByMonth = await countNewUsersGroupedByMonth(Advertiser);
//       const tourGuidesByMonth = await countNewUsersGroupedByMonth(TourGuide);
//       const tourismGovernorsByMonth = await countNewUsersGroupedByMonth(TourismGoverner);
  
//       // Calculate total user count across all roles (excluding Admins)
//       const totalTourists = await Tourist.countDocuments();
//       const totalSellers = await Seller.countDocuments();
//       const totalAdvertisers = await Advertiser.countDocuments();
//       const totalTourGuides = await TourGuide.countDocuments();
//       const totalTourismGovernors = await TourismGoverner.countDocuments();
  
//       const totalUsers = totalTourists + totalSellers + totalAdvertisers + totalTourGuides + totalTourismGovernors;
  
//       // Prepare response
//       res.status(200).json({
//         totalUsers,
//         totalTourists,
//         totalSellers,
//         totalAdvertisers,
//         totalTourGuides,
//         totalTourismGovernors,
//         newUsersByMonth: {
//           tourists: touristsByMonth,
//           sellers: sellersByMonth,
//           advertisers: advertisersByMonth,
//           tourGuides: tourGuidesByMonth,
//           tourismGovernors: tourismGovernorsByMonth,
//         },
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });



 //Helper function to count new users grouped by month and year
const countNewUsersGroupedByMonth = async (Model) => {
  const result = await Model.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 } // Sort by year and month descending
    }
  ]);
  return result;
};

// Admin Route to get user statistics (total new users per month)
router.get('/stats', async (req, res) => {
  try {
    // Get new users grouped by month for all roles (excluding Admins)
    const touristsByMonth = await countNewUsersGroupedByMonth(Tourist);
    const sellersByMonth = await countNewUsersGroupedByMonth(Seller);
    const advertisersByMonth = await countNewUsersGroupedByMonth(Advertiser);
    const tourGuidesByMonth = await countNewUsersGroupedByMonth(TourGuide);
    const tourismGovernorsByMonth = await countNewUsersGroupedByMonth(TourismGoverner);

    // Combine all user groups by month into a single array
    const allUsersByMonth = [
      ...touristsByMonth,
      ...sellersByMonth,
      ...advertisersByMonth,
      ...tourGuidesByMonth,
      ...tourismGovernorsByMonth
    ];

    // Group by month and year to calculate total new users per month
    const totalNewUsersByMonth = allUsersByMonth.reduce((acc, user) => {
      const { year, month } = user._id;
      const monthKey = `${year}-${month < 10 ? '0' + month : month}`; // Format as 'YYYY-MM'

      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += user.count;

      return acc;
    }, {});

    // Calculate total user count across all roles (excluding Admins)
    const totalTourists = await Tourist.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const totalAdvertisers = await Advertiser.countDocuments();
    const totalTourGuides = await TourGuide.countDocuments();
    const totalTourismGovernors = await TourismGoverner.countDocuments();

    const totalUsers = totalTourists + totalSellers + totalAdvertisers + totalTourGuides + totalTourismGovernors;

    // Prepare response
    res.status(200).json({
      totalUsers,
      totalTourists,
      totalSellers,
      totalAdvertisers,
      totalTourGuides,
      totalTourismGovernors,
      totalNewUsersByMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// requests to view all gifts and edit the archived status

// Route to get all gifts (including archived ones)
router.get('/all-gifts', async (req, res) => {
    try {
      const gifts = await GiftItem.find(); // Fetches all gifts without filtering
      res.status(200).json(gifts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gifts', error });
    }
  });
  
  // Route to toggle the archived status of a gift
  router.patch('/all-gifts/archive/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const gift = await GiftItem.findById(id);
      if (!gift) {
        return res.status(404).json({ message: 'Gift item not found' });
      }
  
      // Toggle the archived status
      gift.archived = !gift.archived;
      await gift.save();
  
      res.status(200).json({ message: 'Gift archived status updated', gift });
    } catch (error) {
      res.status(500).json({ message: 'Error updating archive status', error });
    }
  });
  

  
module.exports = router;
