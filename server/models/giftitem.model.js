const mongoose = require('mongoose');

const giftitemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL for the item image
    description: { type: String, required: true },
    price: { type: Number, required: true },
    purchases: { type: Number, default: 0 }, // Tracks how many times the item has been purchased
    quantity: { type: Number, default: 0, required: false }, 
    archived: { type: Boolean, default: false },
    date: { type: Date, required: true } 
});

const GiftItem = mongoose.model('GiftItem', giftitemSchema);
module.exports = GiftItem;
