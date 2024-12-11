# Easytravel

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
    
    - Create a `.env` file with MongoDB URI, JWT secret, email credentials, etc.
    
    ```bash
    MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority
    JWT_SECRET=supersecret
    ```
    
4. **Start the Server:**
    1. Open terminal in server folder (right click on server -> open in integrated terminal)
    2. write command: "npm run dev" (might need to write "npm i" in terminal first)
    
    The server should start on `http://localhost:3000`. 

5.  **Start the Client:**
    1. Open terminal in client folder (right click on client -> open in integrated terminal)
    2. write command: "npm start" (might need to write "npm i" in terminal first)
