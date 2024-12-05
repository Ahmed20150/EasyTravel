const express = require("express");
const router = express.Router();
const Tourist = require("../models/tourist.model");
const Itinerary = require("../models/itinerary.model");
const GiftItem = require('../models/giftitem.model');

// Middleware for authentication (if needed)
const authenticate = (req, res, next) => {
  // Your authentication logic here
  next();
};

router.get("/tourist/:username/preferences", authenticate, async (req, res) => {
  try {
    // Find the tourist by username
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ preferences: tourist.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/bookings/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Query the database for all bookings with the given touristUsername
    const bookings = await Booking.find({ touristUsername: username });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    // You can now save the bookings to another collection, or perform further actions
    // Example: Saving the bookings to another collection or sending them back to the client
    // For example, returning all the booking details
    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Read Tourist Profile by username
router.get("/tourist/:username", authenticate, async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ username: req.params.username })
      .populate("bookedItineraries") // Populate booked itineraries with actual itinerary data
      .exec();

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Tourist Profile by username
router.put("/tourist/:username", authenticate, async (req, res) => {
  const {
    username,
    email,
    mobileNumber,
    nationality,
    dateOfBirth,
    occupation,
  } = req.body;

  try {
    const tourist = await Tourist.findOneAndUpdate(
      { username: req.params.username }, // Update by username
      { email, mobileNumber, nationality, dateOfBirth, occupation },
      { new: true } // Return the updated document
    );

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/bookmarkedEvents/:username", authenticate, async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.json({ bookmarkedEvents: tourist.bookmarkedEvents });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookmarked events" });
  }
});

// Route to add an event to the tourist's bookmarks
router.patch("/bookmarkEvent", authenticate, async (req, res) => {
  const { username, eventId } = req.body;

  try {
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Add the eventId to the bookmarkedEvents array if not already added
    if (!tourist.bookmarkedEvents.includes(eventId)) {
      tourist.bookmarkedEvents.push(eventId);
    } else {
      // If the event is already bookmarked, remove it
      tourist.bookmarkedEvents = tourist.bookmarkedEvents.filter(
        (id) => id !== eventId
      );
    }

    await tourist.save(); // Save the updated tourist document

    res.status(200).json({ message: "Bookmark status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating bookmark status" });
  }
});
router.post("/itineraries/fetch", async (req, res) => {
  const { eventIds } = req.body; // Array of itinerary IDs from the bookmarked events
  try {
    // Fetch itineraries by IDs
    const itineraries = await Itinerary.find({ _id: { $in: eventIds } });
    if (!itineraries.length) {
      return res.status(404).json({ message: "No itineraries found" });
    }
    res.status(200).json(itineraries);
  } catch (err) {
    console.error("Error fetching itineraries", err);
    res.status(500).json({ message: "Error fetching itineraries" });
  }
});

//update booked Itenraries List and Pay with Wallet
router.patch("/bookItinerary", async (req, res) => {
  try {
    const { username, newBookedItineraries, selectedItineraryId } = req.body;

    // Fetch the itinerary price
    const itinerary = await Itinerary.findById(selectedItineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    const itineraryPrice = itinerary.priceOfTour;

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the tourist has enough balance
    if (tourist.wallet < itineraryPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Update the tourist's wallet and bookedItineraries array
    tourist.wallet -= itineraryPrice;
    tourist.bookedItineraries = newBookedItineraries;

    // Save the updated tourist document
    const updatedTourist = await tourist.save();

    res.status(200).json({
      message: "Itinerary booked successfully",
      bookedItineraries: updatedTourist.bookedItineraries,
      wallet: updatedTourist.wallet,
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/unbookItinerary", async (req, res) => {
  try {
    const { username, newBookedItineraries, selectedItineraryId } = req.body;

    // Fetch the itinerary price
    const itinerary = await Itinerary.findById(selectedItineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    const itineraryPrice = itinerary.priceOfTour;

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // refund itenerary price to wallet
    tourist.wallet += itineraryPrice;
    tourist.bookedItineraries = newBookedItineraries;

    // Save the updated tourist document
    const updatedTourist = await tourist.save();

    res.status(200).json({
      message: "Itinerary booked successfully",
      bookedItineraries: updatedTourist.bookedItineraries,
      wallet: updatedTourist.wallet,
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Update BookedItenraries list only
router.patch("/bookItineraryWithCreditCard", async (req, res) => {
  try {
    const { username, newItineraryId } = req.body;

    console.log("Username:", username);
    console.log("New Itinerary ID:", newItineraryId);

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const itinerary = await Itinerary.findById(newItineraryId);

    tourist.bookedItineraries.push(itinerary._id);

    await tourist.save();

    res.status(200).json({
      message: "Itinerary booked successfully",
    });
  } catch (error) {
    console.error("Error updating booked itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/checkWallet/:username/:itineraryId", async (req, res) => {
  try {
    const { username, itineraryId } = req.params;

    // Fetch the tourist data by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Fetch the itinerary data
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if wallet balance is sufficient
    if (tourist.wallet >= itinerary.priceOfTour) {
      return res
        .status(200)
        .json({ message: "Sufficient balance", sufficient: true });
    } else {
      return res
        .status(200)
        .json({ message: "Insufficient balance", sufficient: false });
    }
  } catch (error) {
    console.error("Error checking wallet balance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/bookFlights", async (req, res) => {
  try {
    console.log("Raw request body:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);

    const { username, newBookedFlightId } = req.body;
    console.log("Parsed request:", { username, newBookedFlightId });

    if (!username || !newBookedFlightId) {
      console.log("Missing fields:", { username, newBookedFlightId });
      return res.status(400).json({
        message: "Missing required fields",
        received: { username, newBookedFlightId },
      });
    }

    // Get current tourist data
    const tourist = await Tourist.findOne({ username });
    console.log("Found tourist:", tourist);

    if (!tourist) {
      return res.status(404).json({
        message: "Tourist not found",
        username: username,
      });
    }

    // Ensure BookedFlights is initialized as an array
    const currentFlights = tourist.BookedFlights || [];
    const updatedFlights = [...currentFlights, newBookedFlightId];

    console.log("Current flights:", currentFlights);
    console.log("Updated flights:", updatedFlights);

    const updatedTourist = await Tourist.findOneAndUpdate(
      { username },
      { $set: { BookedFlights: updatedFlights } },
      { new: true }
    );

    console.log("Updated tourist:", updatedTourist);

    res.status(200).json({
      message: "Flight booked successfully",
      bookedFlights: updatedTourist.BookedFlights,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Add or update preferences for a tourist by username
router.patch(
  "/tourist/:username/preferences",
  authenticate,
  async (req, res) => {
    const { preferences } = req.body; // Preferences passed as an array of preference names

    try {
      // Find the tourist by username
      const tourist = await Tourist.findOne({ username: req.params.username });
      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      // Verify the provided preferences exist in the Preference model

      // Update the tourist's preferences
      tourist.preferences = preferences;
      await tourist.save();

      res.status(200).json({
        message: "Preferences updated successfully",
        preferences: tourist.preferences,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Retrieve a tourist's preferences by username
router.get("/tourist/:username/preferences", authenticate, async (req, res) => {
  try {
    // Find the tourist by username
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ preferences: tourist.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/bookmarkedEvents/:username", authenticate, async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.json({ bookmarkedEvents: tourist.bookmarkedEvents });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookmarked events" });
  }
});

// Route to add an event to the tourist's bookmarks
router.patch("/bookmarkEvent", authenticate, async (req, res) => {
  const { username, eventId } = req.body;

  try {
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Add the eventId to the bookmarkedEvents array if not already added
    if (!tourist.bookmarkedEvents.includes(eventId)) {
      tourist.bookmarkedEvents.push(eventId);
    } else {
      // If the event is already bookmarked, remove it
      tourist.bookmarkedEvents = tourist.bookmarkedEvents.filter(
        (id) => id !== eventId
      );
    }

    await tourist.save(); // Save the updated tourist document

    res.status(200).json({ message: "Bookmark status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating bookmark status" });
  }
});

router.post("/itineraries/fetch", async (req, res) => {
  const { eventIds } = req.body; // Array of itinerary IDs from the bookmarked events
  try {
    // Fetch itineraries by IDs
    const itineraries = await Itinerary.find({ _id: { $in: eventIds } });
    if (!itineraries.length) {
      return res.status(404).json({ message: "No itineraries found" });
    }
    res.status(200).json(itineraries);
  } catch (err) {
    console.error("Error fetching itineraries", err);
    res.status(500).json({ message: "Error fetching itineraries" });
  }
});

router.get("/tourist/:username/wishlist", authenticate, async (req, res) => {
  try {
    // Find the tourist by username
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Respond with the wishlist attribute
    res.status(200).json({ wishlist: tourist.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch(
  "/tourist/:username/addToWishlist",
  authenticate,
  async (req, res) => {
    const { giftName } = req.body;

    try {
      // Ensure `giftName` is provided
      if (!giftName) {
        return res.status(400).json({ message: "Gift name is required" });
      }

      // Find the tourist by username
      const tourist = await Tourist.findOne({ username: req.params.username });

      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      // Add the gift name to the wishlist if not already in the array
      if (!tourist.wishlist.includes(giftName)) {
        tourist.wishlist.push(giftName);
        await tourist.save(); // Save the updated document
        return res.status(200).json({
          message: "Gift added to wishlist successfully",
          wishlist: tourist.wishlist,
        });
      } else {
        return res.status(200).json({
          message: "Gift is already in the wishlist",
          wishlist: tourist.wishlist,
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.patch(
  "/tourist/:username/removeFromWishlist",
  authenticate,
  async (req, res) => {
    const { giftName } = req.body;

    try {
      // Ensure `giftName` is provided
      if (!giftName) {
        return res.status(400).json({ message: "Gift name is required" });
      }

      // Find the tourist by username
      const tourist = await Tourist.findOne({ username: req.params.username });

      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      // Check if the gift name exists in the wishlist
      const giftIndex = tourist.wishlist.indexOf(giftName);

      if (giftIndex === -1) {
        return res.status(404).json({
          message: "Gift not found in wishlist",
          wishlist: tourist.wishlist,
        });
      }

      // Remove the gift name from the wishlist
      tourist.wishlist.splice(giftIndex, 1);
      await tourist.save(); // Save the updated document

      return res.status(200).json({
        message: "Gift removed from wishlist successfully",
        wishlist: tourist.wishlist,
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Route to redeem points for a tourist
router.put(
  "/tourist/redeemPoints/:username",
  authenticate,
  async (req, res) => {
    const { points } = req.body;

    try {
      // Find the tourist by username
      const tourist = await Tourist.findOne({ username: req.params.username });
      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      // Check if the tourist has enough points
      if (tourist.points < points) {
        return res.status(400).json({ message: "Insufficient points" });
      }

      // Deduct the points from the tourist's account
      tourist.points -= points;

      // Calculate the amount to add to the wallet
      const dollarsToAdd = Math.floor(points / 10000) * 10;
      tourist.wallet += dollarsToAdd;

      await tourist.save();
      res.status(200).json({
        message: "Points redeemed successfully",
        points: tourist.points,
        wallet: tourist.wallet,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/////////////         cart        ///////////////////////




router.get("/tourist/:username/cart", authenticate, async (req, res) => {
  try {
    // Find the tourist by username and populate the giftItem details in the cart
    const tourist = await Tourist.findOne({ username: req.params.username }).populate(
      "cart.giftItem", // Path to populate
      "name price" // Fields to include from the GiftItem schema
    );

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Respond with the populated cart
    res.status(200).json({ cart: tourist.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: error.message });
  }
});

//Pay for gift with Wallet
router.patch("/wallet/purchaseProduct", async (req, res) => {
  try {
    const { username, totalPrice} = req.body;

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
        // Check if the tourist has enough balance
        if (tourist.wallet < totalPrice) {
          return res.status(400).json({ message: "Insufficient wallet balance" });
        }
    
        // Update the tourist's wallet and bookedItineraries array
        tourist.wallet -= totalPrice;
    
        // Save the updated tourist document
        const updatedTourist = await tourist.save();
    
        res.status(200).json({
          message: "Product purchased successfully",
          wallet: updatedTourist.wallet,
        });
      } catch (error) {
        console.error("Error purchasing product:", error);
        res.status(500).json({ message: "Server error" });

      }
});


router.patch("/tourist/:username/addToCart", authenticate, async (req, res) => {
  const { giftName } = req.body;

  try {
    if (!giftName) {
      return res.status(400).json({ message: "Gift name is required" });
    }

    const giftItem = await GiftItem.findOne({ name: giftName });
    if (!giftItem) {
      return res.status(404).json({ message: "Gift item not found" });
    }

    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const existingCartItem = tourist.cart.find((item) =>
      item.giftItem.equals(giftItem._id)
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      tourist.cart.push({ giftItem: giftItem._id, quantity: 1 });
    }

    await tourist.save();

    // Populate the cart with giftItem details
    const populatedTourist = await Tourist.findOne({ username: req.params.username })
      .populate("cart.giftItem", "name price"); // Replace ObjectId with selected fields

    res.status(200).json({
      message: "Gift item added to cart successfully",
      cart: populatedTourist.cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




router.patch("/tourist/:username/removeFromCart", authenticate, async (req, res) => {
  const { giftName } = req.body;

  try {
    // Validate `giftName` input
    if (!giftName) {
      return res.status(400).json({ message: "Gift name is required" });
    }

    // Find the gift item by name
    const giftItem = await GiftItem.findOne({ name: giftName });
    if (!giftItem) {
      return res.status(404).json({ message: "Gift item not found" });
    }

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the gift item exists in the cart
    const initialCartLength = tourist.cart.length;
    tourist.cart = tourist.cart.filter(
      (item) => !item.giftItem.equals(giftItem._id)
    );

    if (tourist.cart.length === initialCartLength) {
      return res.status(404).json({
        message: "Gift item not found in cart",
        cart: tourist.cart,
      });
    }

    // Save the updated tourist document
    await tourist.save();

    // Populate the cart with gift item details
    const populatedTourist = await Tourist.findOne({ username: req.params.username })
      .populate("cart.giftItem", "name price");

    return res.status(200).json({
      message: "Gift item removed from cart successfully",
      cart: populatedTourist.cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




router.patch("/tourist/:username/updateItemQuantity", authenticate, async (req, res) => {
  const { giftName, newQuantity } = req.body;

  try {
    // Ensure `giftName` and `newQuantity` are provided
    if (!giftName || newQuantity === undefined) {
      return res.status(400).json({ message: "Gift name and new quantity are required" });
    }

    // Ensure newQuantity is a positive integer
    if (newQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    // Find the gift item by name
    const giftItem = await GiftItem.findOne({ name: giftName });
    if (!giftItem) {
      return res.status(404).json({ message: "Gift item not found" });
    }

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username: req.params.username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the gift item exists in the cart
    const existingCartItem = tourist.cart.find((item) =>
      item.giftItem.equals(giftItem._id)
    );

    if (existingCartItem) {
      // Update the quantity if item exists in the cart
      existingCartItem.quantity = newQuantity;
    } else {
      // Add the item to the cart if it doesn't exist
      tourist.cart.push({ giftItem: giftItem._id, quantity: newQuantity });
    }

    // Save the updated tourist document
    await tourist.save();

    // Populate the cart with gift item details
    const populatedTourist = await Tourist.findOne({ username: req.params.username })
      .populate("cart.giftItem", "name price");

    return res.status(200).json({
      message: "Cart quantity updated successfully",
      cart: populatedTourist.cart,
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




router.patch(
  "/tourist/:username/addToCartFromWishlist",
  authenticate,
  async (req, res) => {
    const { giftName } = req.body;

    try {
      if (!giftName) {
        return res.status(400).json({ message: "Gift name is required" });
      }

      const tourist = await Tourist.findOne({ username: req.params.username });
      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      if (!tourist.wishlist.includes(giftName)) {
        return res.status(404).json({ message: "Gift is not in the wishlist" });
      }

      const giftItem = await GiftItem.findOne({ name: giftName });
      if (!giftItem) {
        return res.status(404).json({ message: "Gift item not found" });
      }

      const existingCartItem = tourist.cart.find((item) =>
        item.giftItem.equals(giftItem._id)
      );

      if (existingCartItem) {
        existingCartItem.quantity += 1;
      } else {
        tourist.cart.push({ giftItem: giftItem._id, quantity: 1 });
      }

      await tourist.save();

      res.status(200).json({
        message: "Gift item added to cart successfully",
        cart: tourist.cart,
      });
    } catch (error) {
      console.error("Error adding to cart from wishlist:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);



module.exports = router;
