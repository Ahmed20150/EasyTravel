const express = require("express");
const router = express.Router();
const cors = require("cors");
const Purchase = require("../models/purchase.model.js");
const Gift = require("../models/giftitem.model.js");
const Tourist = require("../models/tourist.model.js");


router.post("/createPurchase", async (req, res) => {
    try {
      const { touristUsername, productId, productName, purchaseDate,quantity,totalPrice } = req.body;
  
      // Find the tourist by touristUsername
      const tourist = await Tourist.findOne({ username: touristUsername });
      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }
  
      // Find the itinerary by ID
      const gift = await Gift.findById(productId);
      if (!gift) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Create a new booking entry
      const newPurchase = new Purchase({
        touristUsername,
        productId,
        productName,
        purchaseDate,
        quantity,
        totalPrice
      });
  
      // Save the booking to the database
      await newPurchase.save();
  
      res.status(201).json({ message: "Purchase created successfully", purchase: newPurchase });
    } catch (error) {
      console.error("Error creating purchase:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/user/:username", async (req, res) => {
    const { username } = req.params;
  
    try {
      const purchases = await Purchase.find({ touristUsername: username });
      res.status(200).json(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ message: "Error fetching purchases." });
    }
  });

  router.delete("/deletePurchase/:productId/:username", async (req, res) => {
    const { productId, username } = req.params;
  
    try {
      const purchase = await Purchase.findOne({ productId, touristUsername: username, status:"Pending"});
      const price= purchase.totalPrice;
  
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
  

    await Purchase.findOneAndDelete({ productId, touristUsername: username, status:"Pending" });

    const tourist = await Tourist.findOne({username:username});

    tourist.wallet += price

    await tourist.save();

      res.status(200).json({ message: "Purchase deleted successfully" });
    } catch (error) {
      console.error("Error deleting purchase:", error);
      res.status(500).json({ message: "Error deleting purchase" });
    }
  });

  router.post("/review", async (req, res) => {
    const { productId, username, rating, review } = req.body;
  
    // Validate required fields
    if (!productId || !username || !rating || !review) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }
  
    try {
      const purchase = await Purchase.findOne({ productId, touristUsername: username, status:"Completed" });
  
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
  
      // Update the purchase with the review and rating
      purchase.rating = rating;
      purchase.review = review;
  
      await purchase.save();
  
      res.status(200).json({ message: "Review submitted successfully" });
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({ message: "Error submitting review" });
    }
  });

  module.exports = router;






