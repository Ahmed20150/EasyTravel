// actt.routes.js
const express = require('express');
const Actt = require('./models/actt.model.js'); // Adjust the path as needed

const router = express.Router();

// GET all actts
router.get('/', async (req, res) => {
    try {
        const actts = await Actt.find({});
        res.status(200).json(actts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Export the router
module.exports = router;
