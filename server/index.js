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
const Reviews = require('./routes/review.routes.js');
const bookingRoutes = require('./routes/booking.routes.js');
const hotelOffers = require("./routes/hotelOffer.routes.js");
const Tourist_TourGuide_Advertiser_Seller = require('./routes/Tourist_ Tour Guide_Advertiser_ Seller.route.js');
const fileRoutes = require('./routes/file.routes.js');
const searchRoutes = require("./routes/search.router.js");

// Models imports
const Tourist = require("./models/tourist.model.js");
const Category = require("./models/category.model.js");
const Preference = require("./models/preference.model.js");
const activities = require("./models/activity.model.js");
const itineraries = require("./models/itinerary.model.js");
const notificationRouter = require("./routes/notificationRouter.js");

const activityRouter= require("./routes/activity.routes.js");

const Review=require("./routes/review.routes.js")
const Transportation=require("./routes/transportation.routes.js")
const museumsandhistoricalplaces = require("./models/museumsAndHistoricalPlaces.model.js");
const GiftItem = require("./models/giftitem.model.js");

// Routes setup

app.use('/api/files', fileRoutes);
app.use('/auth', authRoutes);
app.use('/review',Review);
app.use('/transport',Transportation);


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
app.use('/review', Reviews);
//connect Tourist_ Tour Guide_Advertiser_ Seller.routes.js to index.js
app.use('/Request', Tourist_TourGuide_Advertiser_Seller);
app.use('/api', touristRoutes);
app.use("/museums", museumRoutes);
app.use("/activities", activityRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/gift", giftRoutes);

app.use("/notifications", notificationRouter);
app.use("/tourguide", tourGuideRoutes);
app.use("/booking", bookingRoutes);
app.use("/hotelOffer", hotelOffers);

app.use('/api', tourGuideRoutes);
app.use('/api/Adv', advRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api', searchRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


//TODO arrange routes in their seperate files, keep index clean
//TODO store sendEmail & generateOTP Files in a folder



//getting all tourists
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


app.use('/api', tourGuideRoutes);
app.use('/advertiser', advRoutes);
//app.use()
app.use('/api/seller', sellerRoutes);
app.use('/api/bookmarkEvent', touristRoutes);
app.use('/api', touristRoutes);
app.use(touristRoutes);
app.use('/api/send' , activityRouter);

