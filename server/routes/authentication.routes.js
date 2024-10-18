const express = require("express");
const router = express.Router();
const Admin = require('../models/admin.model');
const TourismGoverner = require('../models/tourismGoverner.model');
const Tourist = require('../models/tourist.model');
const Seller = require("../models/seller.model.js");
const Advertiser = require("../models/advertiser.model.js");
const TourGuide = require("../models/tourGuide.model.js");
const generateOtp = require('../generateOTP'); // Import the generateOtp function
const sendEmail = require('../sendEmail');
const upload = require('../middleware/upload');

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");



/// Create User (Sign up)
router.post('/signUp', upload.single('file'), async (req, res) => {
    try {
      let user;
      const { userType, ...userData } = req.body;
      const username = req.body.username;
      const password = req.body.password;
      const repeatPassword = req.body.repeatPassword;

      
    // Check if username already exists
    let existingUser;
    if (userType === 'tourist') {
      existingUser = await Tourist.findOne({ username });
    } else if (userType === 'tourGuide') {
      existingUser = await TourGuide.findOne({ username });
    } else if (userType === 'advertiser') {
      existingUser = await Advertiser.findOne({ username });
    } else if (userType === 'seller') {
      existingUser = await Seller.findOne({ username });
    } else {
      return res.status(400).json({ message: "Please choose a user type!" });
    }

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

      if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
      }

      if (password !== repeatPassword) {
        return res.status(400).json({ message: "Passwords do not match." });S
      }
  
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+_])[A-Za-z\d@$!%*?&+_]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." });
      }

      if (userType === 'tourist') {
        user = await Tourist.create(userData);
      } else if (userType === 'tourGuide') {
        user = await TourGuide.create(userData);
      } else if (userType === 'advertiser') {
        user = await Advertiser.create(userData);
      } else if (userType === 'seller') {
        user = await Seller.create(userData);
      } else {
        return res.status(400).json({ message: "Please choose a user type!" });
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
  // Login for all users
  router.post('/login', async (req, res) => {
      try {
          const { username, password } = req.body;
          const [tourist, tourGuide, advertiser, seller, admin, tourismGoverner] = await Promise.all([
              Tourist.findOne({ username }),
              TourGuide.findOne({ username }),
              Advertiser.findOne({ username }),
              Seller.findOne({ username }),
              Admin.findOne({ username }),
              TourismGoverner.findOne({username}),
            ]);
  
            const user = tourist || tourGuide || advertiser || seller || admin || tourismGoverner;
          
            if (!user) {
              return res.status(400).json({ message: "username doesnt exist" });
          }
  
           const isPasswordValid = password==user.password;
  
          if (!isPasswordValid) {
              return res.status(400).json({ message: "Invalid password, Tourist pw is "+ user.password + " while your password is " + password });
          }
  
          let userType;
          if (tourist) userType = 'tourist';
          else if (tourGuide) userType = 'tourGuide';
          else if (advertiser) userType = 'advertiser';
          else if (seller) userType = 'seller';
          else if (admin) userType = 'admin';
          else if (tourismGoverner) userType = 'tourismGoverner';
      
  
           //create JWT
          const accessToken = jwt
          .sign(
              {
                  id: user._id,
              },
              "secret",
              { expiresIn: "1d" }
          );
  
          res.status(200).json({ message: "Login successful", user, accessToken: accessToken, userType: userType });
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  });
  
  
  // Change Password Endpoint
  router.post('/changePassword', async (req, res) => {
      const { username, password, newPassword } = req.body;
    
      try {
          const [tourist, tourGuide, advertiser, seller, admin, tourismGoverner] = await Promise.all([
              Tourist.findOne({ username }),
              TourGuide.findOne({ username }),
              Advertiser.findOne({ username }),
              Seller.findOne({ username }),
              Admin.findOne({ username }),
              TourismGoverner.findOne({username}),
            ]);
  
          const user = tourist || tourGuide || advertiser || seller || admin || tourismGoverner;
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const isPasswordValid = password ==  user.password;
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
  router.post('/forgotPassword', async (req, res) => {
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
  router.post('/verifyotp', (req, res) => {
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
  router.post('/changeForgotPassword', async (req, res) => {
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
  

  module.exports = router;