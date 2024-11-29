const express = require('express');
const mongoose = require('mongoose');
const Complaint = require('../models/complaint.model');
const Tourist = require('../models/tourist.model'); // Assuming you have a Tourist model

const router = express.Router();

// POST: File a new complaint
router.post('/create', async (req, res) => {
    try {
      const { title, body, username } = req.body;
  
      // Validate that the username exists and get the tourist ID
      const tourist = await Tourist.findOne({ username });
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      const touristId = tourist._id; // Extract the tourist ID from the found tourist
  
      // Create the complaint with the tourist ID
      const complaint = new Complaint({ title, body, touristId });
      await complaint.save();
  
      res.status(201).json({ message: 'Complaint filed successfully', complaint });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// PUT: Add a reply to a complaint
router.put('/reply/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const check = await Complaint.findById(id);
    // if (check.status==="resolved") {
    //     return res.status(404).json({ error: 'Complaint already resolved' });
    // }
    // Update the complaint with the reply
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { reply }, // Set status to resolved when adding a reply
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Reply added successfully', complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: View all complaints
router.get('/view', async (req, res) => {
    try {
      const complaints = await Complaint.find({});
      //console.log(complaints); // Log complaints to check if it's an array
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// GET: View complaints by tourist ID
router.get('/view/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const tourist = await Tourist.findOne({ username });
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      const touristId = tourist._id; // Get the tourist ID
  
      const complaints = await Complaint.find({ touristId });
  
      if (complaints.length === 0) {
        return res.status(404).json({ message: 'No complaints found for this tourist' });
      }
  
      // Sending complaints array directly
      res.status(200).json({ complaints });  // This is wrapped in an object with a "complaints" key
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Get complaint by ID
router.get("/:id", async (req, res) => {
    const complaintId = req.params.id; // Get the complaint ID from the URL
  
    try {
      // Find the complaint in the database by its ID
      const complaint = await Complaint.findById(complaintId);
  
      if (!complaint) {
        return res.status(404).json({ error: "Complaint not found" });
      }
  
      // Send the complaint details as the response
      res.json(complaint);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

  // PUT request to update complaint status
router.put("/status/:id", async (req, res) => {
    const { id } = req.params;  // Get complaint ID from the URL
    const { status } = req.body; // Get new status from the request body
  
    try {
      // Find the complaint by ID and update its status
      const updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
      
      if (!updatedComplaint) {
        return res.status(404).json({ error: "Complaint not found" });
      }
  
      res.json(updatedComplaint); // Return the updated complaint
    } catch (err) {
      res.status(500).json({ error: "Failed to update complaint status" });
    }
  });

module.exports = router;
