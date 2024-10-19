const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: {
    type: String,
    required: true,
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
    },
  },
  location: {
    address: {
      type: String,
      required: true, // Ensure address is provided
      validate: {
        validator: (v) => typeof v === "string", // Ensure it's a string
      },
    },
  },
  price: {
    min: {
      type: Number,
      required: true,
      min: 0, // Minimum price should be 0
    },
    max: {
      type: Number,
      required: true,
      min: 0, // Minimum price should be 0
    },
  },
  category: {
    type: String,
    required: true,
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
    },
  },
  tags: {
    type: [String],
    validate: {
      validator: (v) => v.every((tag) => typeof tag === "string"), // Ensure all tags are strings
    },
  },
  specialDiscounts: {
    type: String,
    validate: {
      validator: (v) => typeof v === "string" || v === null, // Ensure it's a string or null
    },
  },
  isBookingOpen: { type: Boolean, default: true },
});

// Custom validation for min and max prices
activitySchema.pre("save", function (next) {
  if (this.price.min > this.price.max) {
    return next(
      new Error("Minimum price cannot be greater than maximum price.")
    );
  }
  next();
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
