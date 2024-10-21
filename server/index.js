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
const sendEmail = require('./sendEmail')
//const Actt = require("./models/actt.model.js");

const museumsandhistoricalplaces = require("./models/museumsAndHistoricalPlaces.model.js");
const activities = require("./models/activity.model.js");
const itineraries = require("./models/itinerary.model.js");
const GiftItem = require("./models/giftitem.model.js");

//itineraries
//museumsandhistoricalplaces
// const activities = require("./models/activities.model.js");
// const itinerarie = require("./models/itinerarie.model.js");
// const Activity = require("./models/actt.model.js");



//connect admin.routes.js to index.j
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

mongoose.connect("mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL").then(() => {

    console.log("Connected to the database!");
}).catch((err) => {
    console.log("Cannot connect to the database!", err);
});



//TODO check for repeated emails / usernames
//Create User (Sign up)
app.post('/api/signUp', async (req, res) => { 
    try {
        let user;
        if(req.body.userType === 'tourist'){
         user = await Tourist.create(req.body);
        }
        else if(req.body.userType === 'tourGuide'){
            user = await TourGuide.create(req.body);
        }
        else if(req.body.userType === 'advertiser'){
            user = await Advertiser.create(req.body);

        }
        else if(req.body.userType === 'seller'){
            user = await Seller.create(req.body);
        }
        else{
            res.status(500).json({ message: "please choose a user type!"});
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// //Upload File
// const multer = require('multer');
// const path = require('path');

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: "./public/",
//   filename: function(req, file, cb){
//      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 1000000},
// }).single("myfile");

// //uploading files
// app.post('/upload', upload.single('file'), (req, res) => {
//     try {
//       res.json({ message: 'File uploaded successfully', name: req.file.filename });
//     } catch (error) {
//       console.log(error);
//     }
//   });

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




// get all activities 
app.get('/api/activities', async (req, res) => {
  try {
      const activity = await activities.find({});
      res.status(200).json(activity);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


// get all itineraries

app.get('/api/itineraries', async (req, res) => {
  try {
      const itinerarie = await itineraries.find({});
      res.status(200).json(itinerarie);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


// get all museumsandhistoricalplaces

app.get('/api/museums', async (req, res) => {
  try {
      const museums  = await museumsandhistoricalplaces.find({});
      res.status(200).json(museums);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// get all actts
app.get('/api/actt', async (req, res) => {
  try {
      const actts = await Actt.find({});
      res.status(200).json(actts);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});



// adding a table actt 
app.post("/api/actt", async (req,res) => {
  try {
    const actt =  await Actt.create(req.body);
    res.status(200).json(actt);
} catch (err) {
    res.status(500).json({ message: err.message });
}
})


app.post('/api/museums', async (req, res) => {
  try {
      const museums  = await museumsandhistoricalplaces.create(req.body);
      res.status(200).json(museums);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


app.post('/api/activities', async (req, res) => {
  try {
      const acts  = await activities.create(req.body);
      res.status(200).json(acts);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.post('/api/itineraries', async (req, res) => {
  try {
      const it  = await itineraries.create(req.body);
      res.status(200).json(it);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.put("/api/itineraries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const itinerarie = await itineraries.findByIdAndUpdate(id,req.body);
    if(!itinerarie)
      return res.status(404).json({message:"itinerary not found"})
    const updatedItinerary = await itineraries.findById(id);
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/giftitems', async (req, res) => {
  try {
      const giftItems = await GiftItem.find(); // Assuming you have a GiftItem model
      res.json(giftItems);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch gift items' });
  }
}); 

app.get('/api/giftitems', async (req, res) => {
  try {
    const { purchases } = req.query;

    // Build a filter object
    let filter = {};
    if (purchases) {
      filter.purchases = { $gte: parseInt(purchases, 10) }; // Filter by minimum number of purchases
    }

    // Fetch filtered gift items from the database
    const giftItems = await GiftItem.find(filter);
    res.status(200).json(giftItems);
  } catch (error) {
    console.error('Error fetching gift items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});