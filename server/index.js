const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require("path");

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes imports
const museumRoutes = require("./routes/museumsAndHistoricalPlaces.route.js");
const activityRoutes = require("./routes/activity.routes.js");
const itineraryRoutes = require("./routes/itinerary.routes.js");
const giftRoutes = require("./routes/gift.routes.js");
const adminRoutes = require('./routes/admin.routes.js');
const tourGuideRoutes = require('./routes/tour_guideRoute.js');
const advRoutes = require('./routes/AdvertiserRoute.js');
const sellerRoutes = require('./routes/SellerRoute.js');
const authRoutes = require('./routes/authentication.routes.js');
const touristRoutes = require('./routes/touristRoutes.js');
const Tourist_TourGuide_Advertiser_Seller = require('./routes/Tourist_ Tour Guide_Advertiser_ Seller.route.js');
const fileRoutes = require('./routes/file.routes.js');

// Models imports
const Tourist = require("./models/tourist.model.js");
const TourismGoverner = require("./models/tourismGoverner.model.js");
const Seller = require("./models/seller.model.js");
const Advertiser = require("./models/advertiser.model.js");
const Admin = require("./models/admin.model.js");
const TourGuide = require("./models/tourGuide.model.js");
const GiftItem = require("./models/giftitem.model.js");
const museumsandhistoricalplaces = require("./models/museumsAndHistoricalPlaces.model.js");
const activities = require("./models/activity.model.js");
const itineraries = require("./models/itinerary.model.js");
const Category = require("./models/category.model.js");
const Preference = require("./models/preference.model.js");

// Database connection
require('./config/db');

// Server setup
const port = process.env.PORT || 3000;

// Routes setup
app.use('/api/files', fileRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/Request', Tourist_TourGuide_Advertiser_Seller);
app.use('/api', touristRoutes);
app.use("/museums", museumRoutes);
app.use("/activities", activityRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/gift", giftRoutes);
app.use('/api/Adv', advRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/tourGuide', tourGuideRoutes);

// Route Handlers (Get, Post, Put, Delete)

// Get all tourists
app.get('/api/tourists', async (req, res) => {
    try {
        const tourists = await Tourist.find({});
        res.status(200).json(tourists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Categories Routes
app.post("/api/category", async (req, res) => {
    try {
        const existingCategory = await Category.findOne({ name: req.body.name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const category = await Category.create(req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/api/categories", async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/api/category/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const category = await Category.findOne({ name: name });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const updatedCategory = await Category.findOneAndUpdate({ name: name }, req.body, { new: true });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/api/category/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const category = await Category.findOne({ name: name });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await Category.deleteOne({ name: name });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Preference Routes
app.post("/api/preference", async (req, res) => {
    try {
        const existingPreference = await Preference.findOne({ name: req.body.name });
        if (existingPreference) {
            return res.status(400).json({ message: "Preference already exists" });
        }
        const preference = await Preference.create(req.body);
        res.status(200).json(preference);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/api/preferences", async (req, res) => {
    try {
        const preferences = await Preference.find({});
        res.status(200).json(preferences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/api/preference/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const preference = await Preference.findOne({ name: name });
        if (!preference) {
            return res.status(404).json({ message: "Preference not found" });
        }
        const updatedPreference = await Preference.findOneAndUpdate({ name: name }, req.body, { new: true });
        res.status(200).json(updatedPreference);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/api/preference/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const preference = await Preference.findOne({ name: name });
        if (!preference) {
            return res.status(404).json({ message: "Preference not found" });
        }
        await Preference.deleteOne({ name: name });
        res.status(200).json({ message: "Preference deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all activities
app.get('/api/activities', async (req, res) => {
    try {
        const activity = await activities.find({});
        res.status(200).json(activity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all itineraries
app.get('/api/itineraries', async (req, res) => {
    try {
        const itinerariesData = await itineraries.find({});
        res.status(200).json(itinerariesData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all museums and historical places
app.get('/api/museums', async (req, res) => {
    try {
        const museums = await museumsandhistoricalplaces.find({});
        res.status(200).json(museums);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Gift Item Routes
app.get('/api/giftitems', async (req, res) => {
    try {
        const giftItems = await GiftItem.find();
        res.json(giftItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gift items' });
    }
});

// Listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
