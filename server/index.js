const express = require("express");
const mongoose = require("mongoose");
const app = express();
const museumRoutes = require("./routes/museumsAndHistoricalPlaces.route.js");
const port = process.env.PORT || 3000;
const Tourist = require("./models/tourist.model.js");
const adminRoutes = require('./routes/admin.routes.js');
const Tourist_TourGuide_Advertiser_Seller = require('./routes/Tourist_ Tour Guide_Advertiser_ Seller.route.js')

const cors = require('cors');
app.use(cors());


//connect admin.routes.js to index.js
app.use('/admin', adminRoutes);

//connect Tourist_ Tour Guide_Advertiser_ Seller.routes.js to index.js
app.use('/Request', Tourist_TourGuide_Advertiser_Seller);
const activityRoutes = require("./routes/activity.routes.js");
const itineraryRoutes = require("./routes/itinerary.routes.js");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/museums", museumRoutes);
app.use("/activities", activityRoutes);
app.use("/itinerary", itineraryRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

mongoose.connect("mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL").then(() => {

    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
  });

//Create Tourist
app.post('/api/tourists', async (req, res) => {
    try {
        // const tourist = await Tourist.create(req.body);
        const tourist = await Tourist.create({ "username": "ahmed20150", "email": "a@gmail.com", "password": "123456", "mobile_number": 123456789, "nationality": "Egyptian", "date_of_birth": "2000-01-01", "occupation": "student" });
        res.status(200).json(tourist);
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
