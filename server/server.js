const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const activityBookingRoutes = require('./routes/activityBooking.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/activityBooking', activityBookingRoutes);

// ... rest of your server code