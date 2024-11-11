const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database connection
require('./config/db');

// Server setup
const port = process.env.PORT || 3000;

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
const searchRoutes = require("./routes/search.router.js");

// Models imports
const Tourist = require("./models/tourist.model.js");
const Category = require("./models/category.model.js");
const Preference = require("./models/preference.model.js");
const activities = require("./models/activity.model.js");
const itineraries = require("./models/itinerary.model.js");
const museumsandhistoricalplaces = require("./models/museumsAndHistoricalPlaces.model.js");
const GiftItem = require("./models/giftitem.model.js");

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
app.use('/api', tourGuideRoutes);
app.use('/api/Adv', advRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api', searchRoutes);

// API endpoints
app.get('/api/tourists', async (req, res) => {
    try {
        const tourists = await Tourist.find({});
        res.status(200).json(tourists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/api/category", async (req, res) => {
    try {
        const existingCategory = await Category.findOne({ name: req.body.name });
        if (existingCategory) return res.status(400).json({ message: "Category already exists" });
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
        const updatedCategory = await Category.findOneAndUpdate({ name: req.params.name }, req.body, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/api/category/:name", async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ name: req.params.name });
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Repeat similar code structure for other routes like preferences, activities, itineraries, etc.

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
