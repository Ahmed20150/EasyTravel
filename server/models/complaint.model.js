const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  dateIssued: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending',
  },
  reply: {
    type: String,
    trim: true,
  },
  dateResolved: {
    type: Date,
  },
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist', // Referencing the Tourist schema
    required: true,
  },
});

// Middleware to update `dateResolved` when the status is changed to "resolved"
complaintSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'resolved') {
    this.dateResolved = new Date();
  } else if (this.isModified('status') && this.status !== 'resolved') {
    this.dateResolved = null; // Clear dateResolved if status changes from resolved
  }
  next();
}

);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
