const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
        min: 0  // Ensure the price cannot be negative
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

    ,amountOfPurchases: {
        type: Number,
       default: 0  // Initialize with 0 purchases
    }
});

// Create a model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
