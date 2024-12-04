const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema(
  {
    wishlist: { type: [String], default: [] }, // Array to store wishlist item IDs or names

    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    nationality: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    firstTimeLogin: {
      type: Boolean,
      default: true,
    },
    bookedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary',
      },
    ],
    BookedFlights: [{ type: String }],
    BookedHotels: [{ type: String }],
    preferences: [
      {
        type: String, // Store the names of preferences directly
      },
    ],
    bookmarkedEvents: { type: [String], default: [] }, // Array to store event IDs
    cart: [
      {
        giftItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "GiftItem", // Reference to GiftItem model
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    bookmarkedEvents: { type: [String], default: [] },
    addresses: [ // Array to store multiple delivery addresses
      {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        label: { // A label to help identify the address (e.g., "Home", "Work")
          type: String,
          required: false,
        },
        isDefault: { type: Boolean, default: false  // Add this field if not present
        },
      },
    ],
    currentPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);


const Tourist = mongoose.model('Tourist', touristSchema);

module.exports = Tourist;
