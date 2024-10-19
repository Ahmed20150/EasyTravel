const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: {
    address: String,
  },
  price: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  category: { type: String, required: true },
  tags: [String],
  specialDiscounts: String,
  isBookingOpen: { type: Boolean, default: true },
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
