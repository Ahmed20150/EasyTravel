const mongoose = require('mongoose');

const activityBookingSchema = new mongoose.Schema({
  touristUsername: {
    type: String,
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a static method to check if booking exists
activityBookingSchema.statics.findExistingBooking = async function(touristUsername, activityId) {
  return this.findOne({ touristUsername, activityId });
};

module.exports = mongoose.model('ActivityBooking', activityBookingSchema); 