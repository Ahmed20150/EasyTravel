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
const generateOtp = require('./generateOTP'); // Import the generateOtp function
const sendEmail = require('./sendEmail');
const GiftItem = require("./models/giftitem.model.js"); 

app.use(cors());
app.use(express.json()); 
app.get("/", (req, res) => {
  res.send("Hello World!");
}); 

app.post("/api/giftitems",async(req,res)=> {
  try{
    const giftitem = await GiftItem.create(req.body);

    res.status(200).json(giftitem); 
  } catch(error){
   res.status(500).json({message: error.message});
  }
  

}); 





mongoose.connect(
  "mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL"
).then(() => {
  console.log("Connected to the database!");
}).catch((err) => {
  console.log("Cannot connect to the database!", err);
}); 

















//connect admin.routes.js to index.js
app.use('/admin', adminRoutes);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
//const { error } = require("server/router.js");


app.use(express.json());
app.use(express.urlencoded({extended: true}));




  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })
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

const otpStore = {};
// Forgot Password Endpoint
app.post('/api/forgotPassword', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  //TODO should admin have forget pw?
  const [tourist, tourGuide, advertiser, seller, admin, tourismGoverner] = await Promise.all([
    Tourist.findOne({ email }),
    TourGuide.findOne({ email }),
    Advertiser.findOne({ email }),
    Seller.findOne({ email }),
    Admin.findOne({ email }),
    TourismGoverner.findOne({email}),
  ]);


  const user = tourist || tourGuide || advertiser || seller || admin || tourismGoverner;

  if(!user){
    return res.status(404).json({ message: 'User not found' });
  }

  const otp = generateOtp();
  const subject = 'Your OTP for Login';
  const text = `Your OTP for login is: ${otp}`;

  try {
    await sendEmail(email, subject, text);
    otpStore[email] = otp;
    res.status(200).json({ message: 'OTP sent successfully', otp }); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
});

//verify OTP
app.post('/api/verifyotp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const storedOtp = otpStore[email];

  if (storedOtp && storedOtp === otp) {
    delete otpStore[email]; //remove from memory after verification
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' + storedOtp + " " + otp });
  }
});

// Change Password forgotten password
app.post('/api/changeForgotPassword', async (req, res) => {
    const { email, newPassword} = req.body;
  
    try {
        const [tourist, tourGuide, advertiser, seller, admin, tourismGoverner] = await Promise.all([
            Tourist.findOne({ email }),
            TourGuide.findOne({ email }),
            Advertiser.findOne({ email }),
            Seller.findOne({ email }),
            Admin.findOne({ email }),
            TourismGoverner.findOne({email}),
          ]);

        const user = tourist || tourGuide || advertiser || seller || admin || tourismGoverner;
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

//getting all tourists
app.get('/api/tourists', async (req, res) => {
    try {
        const tourists = await Tourist.find({});
        res.status(200).json(tourists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});












