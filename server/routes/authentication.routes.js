const express = require("express");
const router = express.Router();
const Admin = require('../models/admin.model');
const TourismGoverner = require('../models/tourismGoverner.model');
const Tourist = require('../models/tourist.model');

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");



//TODO check for repeated emails / usernames
//Create User (Sign up)
router.post('/signUp', async (req, res) => { 
    try {
        let user;
        if(req.body.userType === 'tourist'){
         user = await Tourist.create(req.body);
        }
        else if(req.body.userType === 'tourGuide'){
            //create tour guide
        }
        else if(req.body.userType === 'advertiser'){
            //create advertiser

        }
        else{
            //create seller


        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login for Tourist
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const tourist = await Tourist.findOne({ username });

        if (!tourist) {
            return res.status(400).json({ message: "username doesnt exist" });
        }

        const isPasswordValid = password==tourist.password;

        

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password, Tourist pw is "+ tourist.password + " while your password is " + password });
        }

         //create JWT
        const accessToken = jwt
        .sign(
            {
                id: tourist._id,
            },
            "secret",
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "Login successful", tourist, accessToken: accessToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Change Password Endpoint
router.post('/changePassword', async (req, res) => {
    const { username, password, newPassword } = req.body;
  
    try {
      const tourist = await Tourist.findOne({ username });
      if (!tourist) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = password ==  tourist.password;
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      tourist.password = newPassword;
      await tourist.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  module.exports = router;