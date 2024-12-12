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
- **Activity/Itinerary Management:** Create, read, update, delete , flag inappropriate ones.  
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
```  

## Installation  
1. Clone the repository: `git clone https://github.com/{your_username}/EasyTravel.git`  
2. Install dependencies: `npm install`

## API References  
**Routes Overview:**

- **Authentication:**  
  - `POST /signUp`: Create a new user account  
  - `POST /login`: Login existing user  
  - `POST /forgotPassword`: Send OTP for password reset  
  - `POST /changeForgotPassword`: Change password after OTP verification
  - `POST /changePassword`: Change the user's password
  - `POST /verifyotp`: verifies an OTP for a given email by
  - `POST /sendPaymentEmail`: Sends a payment receipt email after verifying the user
  - `POST /send-email`: Sends a generic email to a specified recipient

- **Tourists:**  
  - `GET /:username`: Fetch all tourists  
  - `PUT /tourist/:username`: Updates the tourist's profile (email, mobile number, nationality, etc.).  
  - `GET /tourist/:username/preferences`: Fetches the tourist's preferences.
  - `GET /tourist/:username`: Fetches tourist data by username
  - `PATCH /tourist/:username/preferences`: Updates the tourist's preferences.
  - `GET /api/bookings/:username`: Fetches the tourist's bookings.
  - `GET /bookmarkedEvents/:username`: Fetches the tourist's bookmarked events.
  - `PATCH /bookmarkEvent`: Adds/removes an event from the tourist's bookmarked events.
  - `POST /itineraries/fetch`: Retrieves itineraries based on event IDs.
  - `PATCH /bookItinerary`: Books an itinerary if the tourist has sufficient balance in their wallet.
  - `PATCH /unbookItinerary`: Unbooks an itinerary and refunds the wallet.
  - `GET /checkWallet/:username/:itineraryId`: Checks if the tourist has enough wallet balance for a particular itinerary
  - `GET /tourist/:username/wishlist`: Fetches the tourist's wishlist.
  - `PATCH /tourist/:username/addToWishlist`: Adds a gift to the tourist's wishlist
  - `PATCH /tourist/:username/removeFromWishlist`: Removes a gift from the wishlist
  - `GET /tourist/:username/cart`: Fetches the tourist's cart with populated gift details.
  - `PATCH /tourist/:username/addToCart`: Adds a gift item to the cart
  - `PATCH /wallet/purchaseProduct`: Deducts the price from the tourist's wallet to purchase an item from the cart.
  - `PUT /bookFlights`: Books a flight for the tourist by updating their BookedFlights
  - `PUT /tourist/redeemPoints/:username`: Allows the tourist to redeem points for credit, which is added to their wallet.
  - `PATCH /tourist/:username/removeFromCart`: Removes a gift item from the tourist's cart
  - `PATCH /tourist/:username/updateItemQuantity`: Updates the quantity of an item in the cart
  - `PATCH /tourist/:username/addToCartFromWishlist`: Adds a gift from wishlist to the cart
  - `PUT /bookFlight`:Adds a flight to the tourist's booked flights

- **Tour Guides:**  
  - `POST /profile`: Update tour guide profile info.
  - `GET /profile/:username`: Fetch tour guide profile by username.
  - `GET /tourguide/username/:username`: Find tour guide by username.
  - `GET /email/:username`: Fetch email of tour guide by username.

- **Advertiser:**  
  - `POST /profileAdv`: Update or create advertiser profile info, including company profile PDF and picture.
  - `GET /profileAdv/:username`: Fetch advertiser profile by username.
  - `GET /emailAdv/:username`: Fetch email of advertiser by username.

- **Seller:**  
  - `POST /addGiftItem`: Add a new gift item with details, price, and quantity.
  - `PUT /updateGiftItem/:id`: Update an existing gift item's details.
  - `DELETE /deleteGiftItem/:id`: Delete a gift item by its ID.
  - `POST /profileSeller`: Create or update seller profile information.
  - `GET /profileSeller/:username`: Fetch seller profile by username.
  - `GET /all-gifts`: Get all gift items (including archived ones).
  - `PATCH /all-gifts/archive/:id`: Toggle the archived status of a gift item.

- **Itineraries:**
  - `POST /`: Create a new itinerary.
  - `GET /`: Get all itineraries.
  - `GET /:id`: Get a specific itinerary by its ID.
  - `GET /search`: Search itineraries by name, category, or tags.
  - `PUT /loyaltyPoints`: Update tourist's loyalty points based on payment.
  - `PUT /refundPoints`: Refund loyalty points for a tourist.
  - `PUT /:id`: Update an existing itinerary by its ID.
  - `PUT /toggleActivation/:id`: Toggle the activation status of an itinerary.
  - `DELETE /:id`: Delete an itinerary by its ID.
  - `PATCH /:id`: Update the booking counter for an itinerary.
  - `PATCH /:id/touristsBook`: Update the list of tourists booked for an itinerary.
  - `PUT /deactivateAll/:username`: Deactivate all itineraries for a given username.
  - `DELETE /deleteAll/:username`: Delete all itineraries for a given username.
  - `PATCH /:id/flag`: Flag an itinerary and send a notification to its creator.
  - `GET /notifications/:username`: Retrieve notifications for a specific user.
  - `POST /sendNotification`: Send an email notification to a user.
  - `GET /search`: Search for itineraries based on a query parameter.
  - `PATCH /increment-purchases/:itineraryId`: Increment the number of purchases for all activities in an itinerary.
  - `PATCH /decrement-purchases/:itineraryId`: Decrement the number of purchases for all activities in an itinerary

- **Activities:**
  - `POST /api/activities`: Create a new activity
  - `GET /api/activities`: Fetch all activities
  - `GET /api/activities/:id`: Fetch a specific activity by ID
  - `PUT /api/activities/:id`: Update a specific activity by ID
  - `DELETE /api/activities/:id`: Delete a specific activity by ID
  - `DELETE /api/activities/deleteAll/:username`: Delete all activities by username
  - `PATCH /api/activities/:id`: Flag an activity as inappropriate
  - `GET /api/activities/notifications/:username`: Fetch notifications for a specific user
  - `POST /api/activities/send-notification`: Send an email notification
  - `POST /api/activities/increment/:id`: Increment the number of purchases for an activity by ID

- **Museums & Historical Places:**
  - `POST /api/museums`: Create a new museum entry
  - `GET /api/museums`: Get all museums
  - `GET /api/museums/:id`: Get a single museum by ID
  - `PUT /api/museums/:id`: Update a museum entry by ID
  - `DELETE /api/museums/:id`: Delete a museum by ID

- **Complaints:**
  - `POST /api/complaints/create`: File a new complaint
  - `PUT /api/complaints/reply/:id`: Add a reply to a complaint
  - `GET /api/complaints/view`: View all complaints
  - `GET /api/complaints/view/:username`: View complaints by tourist username
  - `GET /api/complaints/:id`: Get a complaint by ID
  - `PUT /api/complaints/status/:id`: Update complaint status

- **Promo Codes:**  
  - `POST /api/promocodes/create`: Create a new promo code
  - `GET /api/promocodes`: Get all promo codes
  - `DELETE /api/promocodes/:id`: Delete a promo code by ID

- **Payment (Stripe):**  
  - `POST /api/payments/create-checkout-session`: Create a checkout session for an itinerary payment.
  - `GET /api/payments/verify-payment`: Verify the status of a payment using the session ID.
  - `POST /api/payments/product/create-checkout-session`: Create a checkout session for purchasing products.

- **Booking (Itineraries, Hotels, Flights):**
  - `POST /api/bookings/createBooking`: Create a new booking for a tourist and itinerary.
  - `GET /api/bookings/getBooking/:id`: Retrieve a booking by its unique ID.
  - `GET /api/bookings/getBooking/:itineraryId/:touristUsername`: Retrieve a booking by itinerary ID and tourist username.
  - `DELETE /api/bookings/deleteBooking/:itineraryId/:touristUsername`: Delete a booking by itinerary ID and tourist username.
  - `GET /api/bookings/pastBookings`: Fetch past bookings for a tourist (based on username).
  - `GET /api/bookings/upcomingBookings`: Fetch upcoming bookings for a tourist (based on username)
    
- **Address**
  - `POST /api/tourists/:username/addresses`: Add a new address for a specific tourist.
  - `GET /api/tourists/:username/addresses`: Retrieve all addresses of a specific tourist.
  - `PUT /api/tourists/:username/addresses/:addressId/default`: Set an address as the default for a specific tourist.
  - `PUT /api/tourists/:username/addresses/:addressId`: Update an existing address for a specific tourist by ID.
  - `DELETE /api/tourists/:username/addresses/:label`: Delete an address for a specific tourist by its label.

- **Tourist_ Tour Guide_Advertiser_ Seller.route**
  - `POST /api/requestDelete/:username/:role`: Submit an account deletion request for a user based on their username and role.
  
- **activityBooking**
  - `POST /api/createActivityBooking`: Create a new activity booking for a tourist.
  - `GET /api/tourist/:username`: Fetch all activity bookings for a specific tourist.
  - `DELETE /api/unbook/:bookingId`: Unbook an activity if the booking date is more than 48 hours away.
  - `GET /api/check/:activityId/:username`: Check if a tourist has booked a specific activity.
  - `GET /api/checkBooking/:activityId/:username`: Check details of an existing booking for a tourist and activity.
  - `GET /api/pastBookings`: Retrieve past activity bookings for a specific tourist.
  - `GET /api/upcomingBookings`: Fetch upcoming activity bookings for a specific tourist.
    
- **Admin**
  - `POST /addGiftItem`: Add a new gift item with details like name, image, price, and quantity.
  - `PUT /updateGiftItem/:id`: Update details of an existing gift item by its ID.
  - `DELETE /deleteGiftItem/:id`: Delete a gift item by its ID.
  - `POST /add-tourismGoverner`: Add a new Tourism Governer account with a username and password.
  - `POST /add-admin`: Add a new Admin account with a username and password.
  - `DELETE /delete-user/:username/:role`: Delete a user by username and role.
  - `GET /viewAllUsers`: View all users from all schemas (Tourists, Sellers, etc.).
  - `GET /viewRequests`: View all user deletion requests.
  - `GET /pending-tour-guides`: Get pending tour guide requests.
  - `GET /pending-advertisers`: Get pending advertiser requests.
  - `GET /pending-sellers`: Get pending seller requests.
  - `PUT /accept-tour-guide/:id`: Accept a pending tour guide request by its ID.
  - `PUT /reject-tour-guide/:id`: Reject a tour guide by updating their status to "rejected."
  - `PUT /accept-tour-guide/:id`: Accept a tour guide by updating their status to "accepted."
  - `PUT /tourGuide/:id/accept-terms`: Update a tour guide's terms acceptance status.
  - `PUT /reject-advertiser/:id`: Reject an advertiser by updating their status to "rejected."
  - `PUT /accept-advertiser/:id`: Accept an advertiser by updating their status to "accepted."
  - `PUT /advertiser/:id/accept-terms`: Update an advertiser's terms acceptance status.
  - `PUT /reject-seller/:id`: Reject a seller by updating their status to "rejected."
  - `PUT /accept-seller/:id`: Accept a seller by updating their status to "accepted."
  - `PUT /seller/:id/accept-terms`: Update a seller's terms acceptance status.
  - `GET /stats`: Retrieve statistics for all users, including total users and new users grouped by month.
  - `GET /all-gifts`: Retrieve all gift items, including archived ones.
  - `PATCH /all-gifts/archive/:id`: Toggle the archived status of a specific gift item.

- **categories**
  - `GET /`: Retrieve all categories from the database.
    
- **file**
  - `POST /upload`: Upload a file and save its metadata to the database.
  - `DELETE /deleteAll`: Delete all records from the "uploads.chunks", "uploads.files", and "files" collections.
  - `GET /getbasestring`: Fetch the base64 string of a file based on the provided username.
    
- **gift**
  - `GET /search/:name`: Search for gifts by name (case-insensitive) and exclude archived gifts.
  - `GET /`: Get all non-archived gift items.
  - `GET /:id`: Get a specific gift item by its ID.
  - `GET /filter/itemsWithRevenue`: Get gift items with calculated revenue (optional filter by name).
  - `GET /filter/byDate`: Get gift items with revenue, filtered by a specific date.
  - `GET /filter/byMonth`: Get gift items with revenue, filtered by a specific month.
  - `POST /createGiftItem`: Create a new gift item in the database.
  - `POST /purchase/:id`: Increment the purchase count and decrease quantity by 1, and notify the seller if the gift is out of stock.
  - `POST /:id/review`: Add a review to a specific gift item.
    
- **Hotels**
  - `POST /`: Search for hotel offers by city code and filters such as date, adults, price range, etc.
  - `PUT /bookHotels`: Update the tourist's booked hotels list with a new hotel ID.

- **notification**
  - `GET /:username`: Retrieve notifications for a user by their username.
- **Purchase**
 - `POST /createPurchase`: Creates a new purchase for a tourist based on product and user details.
 - `POST /cart/createPurchase`: Adds a new purchase for multiple products in a cart for a tourist.
 - `GET /user/:username`: Retrieves all purchases made by a specific tourist.
 - `DELETE /deletePurchase/:productId/:username`: Deletes a pending purchase by a tourist and refunds the wallet amount.
- **review**
  - `POST /create`: Create a new review for a specific type (e.g., product, tourist) with a rating and comment.
    
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
