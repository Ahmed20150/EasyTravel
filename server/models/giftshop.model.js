const mongoose = require('mongoose');

// Define the gift schema with timestamps
const giftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true  // Add index for faster searching
    },
    image: {
        type: String,  // Usually, this will be a URL to the image
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number']  // Custom error message
    },
    amountOfPurchases: {
        type: Number,
        default: 0  // Initialize with 0 purchases
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt

// Create a model from the schema
const gift = mongoose.model('gift', giftSchema);

module.exports = gift;
