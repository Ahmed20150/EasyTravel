const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json({ limit: '10mb' })); // Set limit to 10MB or more depending on your needs
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const cors = require("cors");
const museumRoutes = require("./routes/museumsAndHistoricalPlaces.route.js");
const port = process.env.PORT || 3000;
const Tourist = require("./models/tourist.model.js");
const TourismGoverner = require("./models/tourismGoverner.model.js");
const Seller = require("./models/seller.model.js");
const Advertiser = require("./models/advertiser.model.js");
const Admin = require("./models/admin.model.js");
const TourGuide = require("./models/tourGuide.model.js");
const adminRoutes = require('./routes/admin.routes.js');
const tourGuideRoutes = require('./routes/tour_guideRoute.js');
const advRoutes = require('./routes/AdvertiserRoute.js');
const sellerRoutes = require('./routes/SellerRoute.js');
const authRoutes = require('./routes/authentication.routes.js');
const touristRoutes = require('./routes/touristRoutes.js');
const nodemailer = require("nodemailer");
const generateOtp = require('./generateOTP'); // Import the generateOtp function
const sendEmail = require('./sendEmail')

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
app.use('/auth', authRoutes);



const Tourist_TourGuide_Advertiser_Seller = require('./routes/Tourist_ Tour Guide_Advertiser_ Seller.route.js')
const Category= require("./models/category.model.js");
const Preference= require("./models/preference.model.js");

//connect admin.routes.js to index.js

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());

app.use('/admin', adminRoutes);

//connect Tourist_ Tour Guide_Advertiser_ Seller.routes.js to index.js
app.use('/Request', Tourist_TourGuide_Advertiser_Seller);
const activityRoutes = require("./routes/activity.routes.js");
const itineraryRoutes = require("./routes/itinerary.routes.js");
app.use('/api', touristRoutes);

app.use("/museums", museumRoutes);
app.use("/activities", activityRoutes);
app.use("/itinerary", itineraryRoutes);
app.use('/gift', giftRoutes);

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


//getting all tourists
app.get('/api/tourists', async (req, res) => {
    try {
        const tourists = await Tourist.find({});
        res.status(200).json(tourists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






////////////// category ////////////
app.post("/api/category", async (req, res) => {
  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: req.body.name });
    
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create the new category
    const category = await Category.create(req.body);
    res.status(200).json(category);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/api/category", async (req, res) =>{
  try{
    const category = await Category.find({});
    res.status(200).json(category);

  }catch{
    res.status(500).json({message:error.message});

  }
})


app.put("/api/category/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.findOne({ name: name });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Assuming you have some data to update in the request body
    const updatedData = req.body; // Get the new data from the request body

    // Update the category
    const updatedCategory = await Category.findOneAndUpdate(
      { name: name },
      updatedData,
      { new: true } // Return the updated document
    );

    // Return the updated category
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

    // Perform the deletion
    await Category.deleteOne({ name: name });

    // Respond with a success message
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});








////////// preference /////////

app.post("/api/preference", async (req, res) => {
  try {
    // Check if the preference category already exists
    const existingPreference = await Preference.findOne({ name: req.body.name });
    
    if (existingPreference) {
      return res.status(400).json({ message: "preference already exists" });
    }

    // Create a new preference if it doesn't exist
    const preference = await Preference.create(req.body);
    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/preference", async (req, res) =>{
  try{
    const preference = await Preference.find({});
    res.status(200).json(preference);

  }catch{
    res.status(500).json({message:error.message});

  }
})





app.put("/api/preference/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const preference = await Preference.findOne({ name: name });

    if (!preference) {
      return res.status(404).json({ message: "preference tag not found" });
    }

    // Assuming you have some data to update in the request body
    const updatedData = req.body; // Get the new data from the request body

    // Update the category
    const updatedPreference = await Preference.findOneAndUpdate(
      { name: name },
      updatedData,
      { new: true } // Return the updated document
    );

    // Return the updated preference
    res.status(200).json(updatedPreference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




////////////// category ////////////
app.post("/api/category", async (req, res) => {
  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: req.body.name });
    
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create the new category
    const category = await Category.create(req.body);
    res.status(200).json(category);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/api/category", async (req, res) =>{
  try{
    const category = await Category.find({});
    res.status(200).json(category);

  }catch{
    res.status(500).json({message:error.message});

  }
})


app.put("/api/category/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.findOne({ name: name });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Assuming you have some data to update in the request body
    const updatedData = req.body; // Get the new data from the request body

    // Update the category
    const updatedCategory = await Category.findOneAndUpdate(
      { name: name },
      updatedData,
      { new: true } // Return the updated document
    );

    // Return the updated category
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

    // Perform the deletion
    await Category.deleteOne({ name: name });

    // Respond with a success message
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});








////////// preference /////////

app.post("/api/preference", async (req, res) => {
  try {
    // Check if the preference category already exists
    const existingPreference = await Preference.findOne({ name: req.body.name });
    
    if (existingPreference) {
      return res.status(400).json({ message: "preference already exists" });
    }

    // Create a new preference if it doesn't exist
    const preference = await Preference.create(req.body);
    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/preference", async (req, res) =>{
  try{
    const preference = await Preference.find({});
    res.status(200).json(preference);

  }catch{
    res.status(500).json({message:error.message});

  }
})





app.put("/api/preference/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const preference = await Preference.findOne({ name: name });

    if (!preference) {
      return res.status(404).json({ message: "preference tag not found" });
    }

    // Assuming you have some data to update in the request body
    const updatedData = req.body; // Get the new data from the request body

    // Update the category
    const updatedPreference = await Preference.findOneAndUpdate(
      { name: name },
      updatedData,
      { new: true } // Return the updated document
    );

    // Return the updated preference
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
      return res.status(404).json({ message: "preference tag not found" });
    }

    // Perform the deletion
    await Preference.deleteOne({ name: name });

    // Respond with a success message
    res.status(200).json({ message: "Preference tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/preference/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const preference = await Preference.findOne({ name: name });

    if (!preference) {
      return res.status(404).json({ message: "preference tag not found" });
    }

    // Perform the deletion
    await Preference.deleteOne({ name: name });

    // Respond with a success message
    res.status(200).json({ message: "Preference tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.use('/api', tourGuideRoutes);
app.use('/api/Adv', advRoutes);
app.use('/api/seller', sellerRoutes);
// app.listen(3000, () => console.log('Server running on port 3000'));

