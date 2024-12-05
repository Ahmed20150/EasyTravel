const express = require("express");
require('dotenv').config();
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Ensure your secret key is set in environment variables

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { itineraryId, itineraryName, price, selectedDate, selectedTime } = req.body;
    console.log(process.env.STRIPE_SECRET_KEY);

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur", // Adjust currency as needed
            product_data: {
              name: itineraryName,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5000/payment-success?session_id={CHECKOUT_SESSION_ID}&itemType=itinerary&itemId=${itineraryId}&selectedDate=${encodeURIComponent(selectedDate)}&selectedTime=${encodeURIComponent(selectedTime)}`,
      cancel_url: `http://localhost:5000/payment-cancel?itemType=itinerary`,
    });

    res.json({ url: session.url });
    // res.redirect(303, session.url);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/verify-payment", async (req, res) => {
    try {
      const { session_id, itineraryId } = req.query;
  
      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id);
  
      if (session.payment_status === "paid") {
        res.json({ message: "Payment verified." });
      } else {
        res.status(400).json({ error: "Payment not successful." });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.post("/product/create-checkout-session", async (req, res) => {
    try {
      const { productId, productName, price} = req.body;
      console.log(process.env.STRIPE_SECRET_KEY);
  
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur", // Adjust currency as needed
              product_data: {
                name: productName,
              },
              unit_amount: Math.round(price * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&itemType=product&itemId=${productId}`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel?itemType=product`,
      });
  
      res.json({ url: session.url });
      // res.redirect(303, session.url);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

module.exports = router;