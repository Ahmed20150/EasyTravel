const express = require("express");
const router = express.Router();
const Admin = require('../models/admin.model');
const TourismGoverner = require('../models/tourismGoverner.model');
const Product = require('../models/giftshop.model'); // Import the Product model

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
        const newTourismGoverner = new TourismGoverner({
            username,
            password
        });
        await newTourismGoverner.save(); // Corrected save method call
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
        const newAdmin = new Admin({
            username,
            password
        });
        await newAdmin.save(); // Corrected save method call
        res.status(201).json({ message: 'Admin Account Added Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error Creating new Admin Account', error });
    }
});

// Add Product to Gift Shop
router.post('/add-product', async (req, res) => {
    const { name, image, description, price } = req.body;

    if (!name || !image || !description || !price) {
        return res.status(400).json({ message: 'All fields (name, image, description, price) are required' });
    }

    try {
        const newProduct = new Product({
            name,
            image,
            description,
            price,
            amountOfPurchases: 0 // Initializes to 0 when product is created
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product Added Successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error Adding Product', error });
    }
});

module.exports = router;
