const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    promoCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[A-Za-z0-9]{4,10}$/, // Allow both lowercase and uppercase letters, and numbers
    },
    discount: {
        type: Number,
        required: true,
        min: 1, // Minimum discount value
    },
    expiryDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('PromoCode', promoCodeSchema); // The collection name will be 'promoCodes'