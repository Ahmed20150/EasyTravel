const mongoose = require('mongoose');

const deletionRequestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    requestDate: {
        type: Date,
        default: Date.now, // Automatically set the current date
    },
    status: {
        type: String,
        enum: ['Pending', 'Processed'], // Adjust status values as needed
        default: 'Pending',
    },
});

module.exports = mongoose.model('DeletionRequest', deletionRequestSchema);
