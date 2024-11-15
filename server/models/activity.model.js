const mongoose = require("mongoose");
//const reviewSchema = require("./review");

const activitySchema = new mongoose.Schema({
  creator: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  time: {
    type: String,
    required: [true, "Time is required"],
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
      message: "Time must be a string",
    },
  },
  location: {
    address: {
      type: String,
      required: [true, "Address is required"], // Ensure address is provided
      validate: {
        validator: (v) => typeof v === "string", // Ensure it's a string
        message: "Address must be a string",
      },
    },
  },
  price: {
    min: {
      type: Number,
      required: [true, "Minimum price is required"],
      min: [0, "Minimum price must be 0 or greater"], // Minimum price should be 0
    },
    max: {
      type: Number,
      required: [true, "Maximum price is required"],
      min: [0, "Maximum price must be 0 or greater"], // Minimum price should be 0
    },
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    validate: {
      validator: (v) => typeof v === "string", // Ensure it's a string
      message: "Category must be a string",
    },
  },
  tags: {
    type: [String],
    validate: {
      validator: (v) => v.every((tag) => typeof tag === "string"), // Ensure all tags are strings
      message: "All tags must be strings",
    },
  },
  specialDiscounts: {
    type: Number,
    min: [0, "Special discount must be 0 or greater"], // Minimum special discount should be 0
    max: [100, "Special discount cannot exceed 100"], // Maximum special discount should be 100
  },
  isBookingOpen: { type: Boolean, default: true },
  numofpurchases: { type: Number, default: 0 },

  ratings: [
    {
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  totalRatingCount: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
});
activitySchema.methods.updateRatings = function () {
  this.totalRatingCount = this.ratings.length;
  const sum = this.ratings.reduce((acc, review) => acc + review.rating, 0);
  this.avgRating = this.totalRatingCount ? sum / this.totalRatingCount : 0;
  return this.save();
};

// Create Review Method
activitySchema.methods.createReview = function (rating, comment) {
  this.ratings.push({ rating, comment });
  return this.updateRatings(); // Update total count and average rating
};

// Middleware to validate that min price is not greater than max price on save
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
