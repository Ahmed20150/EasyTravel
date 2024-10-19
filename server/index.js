const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const Tourist = require("./models/tourist.model.js");
const activityRoutes = require("./routes/activity.routes.js");
const itineraryRoutes = require("./routes/itinerary.routes.js");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/activities", activityRoutes);
app.use("/itinerary", itineraryRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

mongoose
  .connect(
    "mongodb+srv://ahmed1gasser:jxaauvDrMDrxvUQS@acl.05st6.mongodb.net/?retryWrites=true&w=majority&appName=ACL"
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
  });
