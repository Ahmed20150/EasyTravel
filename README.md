# Project Title  
**Easytravel** (ACL Project)

## Motivation  
This application aims to enhance the user experience by seamlessly connecting tourists, advertisers, tour guides, sellers, and tourism governors. It simplifies processes such as activity and itinerary bookings, e-commerce product sales, and the management of complaints and notifications, all within a unified system. Designed as the backbone of an integrated travel and tourism platform, it streamlines both administrative tasks and user-facing operations.

## Code Style  
- The code follows a modular approach by separating models, routes, and controllers.  
- ESLint not configured, but basic conventions like using `async/await` and proper try/catch blocks are followed.


## Tech/Framework Used  
- **Backend:** Node.js, Express.js, Mongoose  
- **Database:** MongoDB  
- **Payments:** Stripe (Testing Environment)  
- **Authentication:** JWT, bcrypt  
- **File Uploads:** Multer

## Features  
- **User Roles:** Tourists, Tour Guides, Advertisers, Sellers, Admin, Tourism Governor.  
- **Itinerary Management:** Create, read, update, delete itineraries, flag inappropriate ones.  
- **Activities:** CRUD operations, purchase count increments.  
- **Gift Items:** Add to cart, wishlist, purchase and manage stock.  
- **Hotel & Flight Booking:** Integration with external APIs for hotels (Amadeus test environment) and mock flight booking.  
- **ACL & Deletion Requests:** Users can request account deletion. Admin checks conditions before approval.  
- **Complaints & Notifications:** File complaints, mark resolved, send notifications.  
- **Promo Codes & Points System:** Apply promo codes, gain loyalty points for purchases, redeem points for discounts.

## Code Examples

**Example: Adding a New Itinerary (POST /itinerary)**  

```javascript
// CREATE
router.post("/", async (req, res) => {
  try {
    const newItinerary = new Itinerary(req.body);
    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).send({ errors });
    }
    res.status(500).json({ error: error.message });
  }
});
```

**Example: Booking an Itinerary & Payment with Stripe (payment.routes.js)**
```javascript
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
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&itineraryId=${itineraryId}&selectedDate=${encodeURIComponent(selectedDate)}&selectedTime=${encodeURIComponent(selectedTime)}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
    // res.redirect(303, session.url);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
```  

## Installation  
1. Clone the repository: `git clone https://github.com/{your_username}/EasyTravel.git`  
2. Install dependencies: `npm install`

## API References  
**Routes Overview:**

- **Authentication:**  
  - `POST /auth/signUp`: Create a new user account  
  - `POST /auth/login`: Login existing user  
  - `POST /auth/forgotPassword`: Send OTP for password reset  
  - `POST /auth/changeForgotPassword`: Change password after OTP verification

- **Tourists:**  
  - `GET /api/tourists`: Fetch all tourists  
  - `GET /api/tourists/:username`: Fetch a single tourist by username  
  - `PUT /api/tourists/:username`: Update tourist profile  
  - `PATCH /api/tourists/:username/addToWishlist`: Add gift to wishlist

- **Tour Guides:**  
  - `POST /api/profile`: Update tour guide profile info  
  - `GET /api/profile/:username`: Fetch profile of tour guide

- **Advertiser:**  
  - `POST /advertiser/profileAdv`: Create/Update Advertiser profile  
  - `GET /advertiser/emailAdv/:username`: Get advertiser email by username

- **Seller:**  
  - `POST /api/seller/addGiftItem`: Add new gift item  
  - `PATCH /api/seller/all-gifts/archive/:id`: Archive/unarchive a gift item

- **Itineraries:**  
  - `POST /itinerary`: Create new itinerary  
  - `GET /itinerary`: List all itineraries  
  - `GET /itinerary/:id`: Fetch single itinerary detail  
  - `PATCH /itinerary/:id/touristsBook`: Add booked tourist to itinerary

- **Activities:**  
  - `POST /activities`: Create a new activity  
  - `GET /activities`: Fetch all activities  
  - `PATCH /activities/:id`: Flag an activity

- **Museums & Historical Places:**  
  - `POST /museums`: Add new museum/historical place  
  - `GET /museums`: Fetch all places
  - `PUT /museums/:id`: Update a place

- **Complaints:**  
  - `POST /complaint/create`: File a complaint  
  - `PUT /complaint/reply/:id`: Reply to complaint

- **Promo Codes:**  
  - `POST /api/promo-codes/create`: Create a promo code  
  - `GET /api/promo-codes`: List all promo codes

- **Payment (Stripe):**  
  - `POST /payment/create-checkout-session`: Create Stripe checkout session  
  - `GET /payment/verify-payment`: Verify payment status

- **Booking (Itineraries, Hotels, Flights):**  
  - `POST /booking/createBooking`: Create a new itinerary booking  
  - `PUT /hotelOffer/bookHotels`: Book a hotel by updating tourist’s booked hotels  
  - `PUT /api/bookFlights`: Add flight booking to tourist’s record


## Tests  
- **Postman Tests:**  
  Requests were tested using Postman collections for:
  - Authentication (login, signup)  
  - CRUD operations (Activities, Itineraries, Museums)  
  - Payment endpoint with Stripe test keys  
  - Complaints filing and replying

## How to Use  
1. Run `npm start` to start the server on `http://localhost:3000/`.  
2. Use an API client like Postman or a frontend interface to interact with routes.

## Contribute  
Contributions are welcome! If you find a bug or want to add a feature, open an issue or submit a pull request. The project is not perfect; improvements, refactorings, and optimizations are encouraged.

## Credits  
- **Documentation & Code Inspirations:**  
  - Official Mongoose and Express.js Documentation  
  - YouTube tutorials from Traversy Media, Academind, and NetNinja (for general Node.js best practices)  
  - Stripe Documentation for Payment Integration 

## License  
- **Stripe:** Used under Stripe’s licensing terms.  
- **Apache 2.0 License:** The codebase can be considered under Apache 2.0 license to align with common open-source practices.  
