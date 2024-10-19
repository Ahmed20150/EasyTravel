const express = require("express");
const router = express.Router();
const Admin = require('../models/admin.model');
const TourGuide = require('../models/tourGuide.model'); 
const Advertiser = require('../models/advertiser.model'); 
const Seller = require('../models/seller.model'); 
const TourismGoverner = require('../models/tourismGoverner.model');
const bcrypt = require('bcrypt');

// Add Tourism Governer
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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTourismGoverner = new TourismGoverner({
            username,
            password: hashedPassword
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

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password Required' });
    }

    try {
        const NonUniqueUser = await Admin.findOne({ username });
        if (NonUniqueUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            username,
            password: hashedPassword
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin Account Added Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error Creating new Admin Account', error });
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
router.put('/tour-guide/:id/accept-terms', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedGuide = await TourGuide.findByIdAndUpdate(id, { firstTimeLogin: 2 }, { new: true });
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
        const updatedAdvertiser = await Advertiser.findByIdAndUpdate(id, { firstTimeLogin: 2 }, { new: true });
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
        const updatedSeller = await Seller.findByIdAndUpdate(id, { firstTimeLogin: 2 }, { new: true });
        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json({ message: 'Terms accepted for seller', data: updatedSeller });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting terms for seller', error: error.message });
    }
});

module.exports = router;
