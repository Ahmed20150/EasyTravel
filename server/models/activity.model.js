const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    date: Date,
    time: String,
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    price: {
        min: Number,
        max: Number
    },
    category: String,
    tags: [String],
    specialDiscounts: String,
    isBookingOpen: { type: Boolean, default: true }
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
