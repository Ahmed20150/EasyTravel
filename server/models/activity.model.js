const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    price: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    specialDiscounts: { type: String },
    isBookingOpen: { type: Boolean, required: true }
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
