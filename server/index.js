const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const giftRoutes = require('./routes/gift.routes'); // Ensure this file exists with the appropriate routes
const Tourist = require("./models/tourist.model.js");
const TourismGoverner = require("./models/tourismGoverner.model.js");
const Seller = require("./models/seller.model.js");
const Advertiser = require("./models/advertiser.model.js");
const Admin = require("./models/admin.model.js");
const TourGuide = require("./models/tourGuide.model.js");
const adminRoutes = require('./routes/admin.routes.js');
const nodemailer = require("nodemailer");
const generateOtp = require('./generateOTP');
const sendEmail = require('./sendEmail');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect("mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL")
   
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/admin', adminRoutes);
app.use('/api/gift', giftRoutes); // Include product routes

// Create User (Sign up)
app.post('/api/signUp', async (req, res) => {
    try {
        let user;
        if(req.body.userType === 'tourist'){
            user = await Tourist.create(req.body);
        } else if(req.body.userType === 'tourGuide'){
            user = await TourGuide.create(req.body);
        } else if(req.body.userType === 'advertiser'){
            user = await Advertiser.create(req.body);
        } else if(req.body.userType === 'seller'){
            user = await Seller.create(req.body);
        } else {
            return res.status(500).json({ message: "please choose a user type!" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login for all users
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [tourist, tourGuide, advertiser, seller, admin, tourismGoverner] = await Promise.all([
            Tourist.findOne({ username }),
            TourGuide.findOne({ username }),
            Advertiser.findOne({ username }),
            Seller.findOne({ username }),
            Admin.findOne({ username }),
            TourismGoverner.findOne({ username }),
        ]);

        const user = tourist || tourGuide || advertiser || seller || admin || tourismGoverner;

        if (!user) {
            return res.status(400).json({ message: "username doesn't exist" });
        }

        const isPasswordValid = password == user.password;

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        let userType;
        if (tourist) userType = 'tourist';
        else if (tourGuide) userType = 'tourGuide';
        else if (advertiser) userType = 'advertiser';
        else if (seller) userType = 'seller';
        else if (admin) userType = 'admin';
        else if (tourismGoverner) userType = 'tourismGoverner';

        // Create JWT
        const accessToken = jwt.sign({ id: user._id }, "secret", { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", user, accessToken, userType });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change Password Endpoint
app.post('/api/changePassword', async (req, res) => {
    const { username, password, newPassword } = req.body;

    try {
        const [tourist, tourGuide, advertiser, seller, admin, tourismGoverner] = await Promise.all([
            Tourist.findOne({ username }),
            TourGuide.findOne({ username }),
            Advertiser.findOne({ username }),
            Seller.findOne({ username }),
            Admin.findOne({ username }),
            TourismGoverner.findOne({ username }),
        ]);

        const user = tourist || tourGuide || advertiser || seller || admin || tourismGoverner;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = password == user.password;
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Additional endpoints as required...

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
