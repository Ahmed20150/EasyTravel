const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
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
const upload = require('./middleware/upload');

/////////////////UPLOADING IMPORTS///////////////////////////////////////////////////////
const bodyParser = require('body-parser');
const fileRoutes = require('./routes/file.routes.js');
const Grid = require('gridfs-stream');

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb',  extended: true }));
app.use(cors());

require('./config/db');

app.use('/api/files', fileRoutes);



/////////////////////////////////////////////////////////////////////////
//connect admin.routes.js to index.js
app.use('/admin', adminRoutes);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());


// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// const conn = mongoose.createConnection("mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL", { useNewUrlParser: true,
//   useUnifiedTopology: true,});

// let gfs;
// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
//   console.log('Connected to GridFS');
// });

//TODO arrange routes in their seperate files, keep index clean
//TODO store sendEmail & generateOTP Files in a folder
//TODO check for repeated emails / usernames

// Create User (Sign up)
app.post('/api/signUp', upload.single('file'), async (req, res) => {
  try {
    let user;
    const { userType, ...userData } = req.body;
    const file = req.file;

    if (file) {
      userData.file = file.path; // Add file path to user data
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


// Endpoint to handle file upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const { name, dateOfBirth } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'File is required' });
  }

  try {
    const tourist = new Tourist({
      name,
      dateOfBirth,
      file: file.path // Store the file path in the database
    });

    await tourist.save();
    res.status(201).json({ message: 'Tourist created successfully', tourist });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tourist', error });
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
app.post('/api/changePassword', async (req, res) => {
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
