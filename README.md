# Title: Easytravel

## Motivation
This application aims to enhance the user experience by seamlessly connecting tourists, advertisers, tour guides, sellers, and tourism governors. It simplifies processes such as activity and itinerary bookings, e-commerce product sales, and the management of complaints and notifications, all within a unified system. Designed as the backbone of an integrated travel and tourism platform, it streamlines both administrative tasks and user-facing operations.


## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/{your_username}/EasyTravel.git
    ```
    
2. **Install Dependencies:**
    ```bash
    npm install
    ```
    
3. **Environment Setup:**
   - Create a `.env` file with the following.
    
    ```bash
    CLIENT_URL=http://localhost:5000
    REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51QJzQkGhMAvFexjPfti0di5UA4qvwue5MEyCO6auJuOsigwq0Ru9j4doaqQN4pEOVVgZWNCt7QOTdHVCXaoiHsD400MT2p8Jf2
    STRIPE_SECRET_KEY=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 
    ```
    
4. **Start the Server:**
    1. Open terminal in server folder (right click on server -> open in integrated terminal)
    2. write command: "npm run dev" (might need to write "npm i" in terminal first)
    
    The server should start on `http://localhost:3000`. 

5.  **Start the Client:**
    1. Open terminal in client folder (right click on client -> open in integrated terminal)
    2. write command: "npm start" (might need to write "npm i" in terminal first)

## Features

1. **User Management**:
   - Create, update, and delete users with roles such as Tourist, Tour Guide, Advertiser, Seller, Tour Governor, and Admin.
   - Provide password reset functionality via OTP.

2. **Activity & Itinerary Booking**:
   - Book, cancel, and view upcoming or past bookings for activities and itineraries.
   - Allow users to rate and review activities, itineraries, and tour guides.

3. **E-Commerce Features**:
   - Add, update, and remove products with ease.
   - Manage product inventory, orders, and cart functionality efficiently.
   - Enable wishlist management for tourists.

4. **Complaints & Content Flagging**:
   - File complaints regarding activities and itineraries.
   - Allow admins to respond to and resolve complaints.
   - Facilitate flagging inappropriate activities and itineraries, with automated refunds and booking cancellations.

5. **Notifications**:
   - Send real-time notifications for flagged activities and itineraries.
   - Deliver promotional email notifications, including discount codes and offers.

6. **Revenue & Reporting**:
   - Generate detailed sales reports for Tour Guides and Advertisers.
   - Calculate and filter revenue by specific months or dates.


## Credits

**Developers:**

- [ Names ]

**Helpful sources:**

- Stack Overflow
- Official Node.js and Express documentation
- MongoDB Mongoose documentation
