const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  creator: {
    type: String,
  },
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
    type: Number,
    min: 0, // Minimum special discount should be 0
    max: 100, // Maximum special discount should be 100
  },
  isBookingOpen: { type: Boolean, default: true },
});

activitySchema.pre("save", function (next) {
  if (this.price.min > this.price.max) {
    return next(
      new Error("Minimum price cannot be greater than maximum price.")
    );
  }
  next();
});

// Apply the same validation logic for update operations
activitySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.price && update.price.min > update.price.max) {
    return next(
      new Error("Minimum price cannot be greater than maximum price.")
    );
  }
  next();
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
