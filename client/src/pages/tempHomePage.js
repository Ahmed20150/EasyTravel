import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCurrency } from "../components/CurrencyContext";
// import "./TempHomePage.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GeneralNavbar from "../components/GeneralNavbar";
import { Navbar, Button, Card, Footer } from "flowbite-react";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle } from "../styles/gasserStyles"; 
import HomeCard from "../components/HomeCard";



const TempHomePage = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState(Cookies.get("username"));
  const [userType, setUserType] = useState(Cookies.get("userType"));
  const [userEmail, setUserEmail] = useState(null); // State to store email for admin users
  const { selectedCurrency, setSelectedCurrency, exchangeRates } =
    useCurrency();

  useEffect(() => {
    /**
     * Fetch the wishlist for a tourist by username.
     * @param {string} username - The username of the tourist.
     * @returns {Promise<Object>} - A promise resolving to the wishlist data or an error message.
     */
    const fetchWishlist = async (username) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tourist/${username}/wishlist`
        );
        return response.data; // Contains the wishlist array
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw new Error(
          error.response?.data?.message || "Failed to fetch wishlist"
        );
      }
    };

    fetchData();
    if (userType !== "admin") {
      fetchNotifications();
    } else {
      fetchEmail(); // Fetch email only if the user is an admin
    }
  }, [userType, username]);

  async function fetchData() {
    const accessToken = Cookies.get("token");
    const acceptedTerms = Cookies.get("acceptedTerms");

    if (!accessToken || acceptedTerms === "false") {
      navigate("/");
      return;
    }
  }

  const fetchNotifications = async () => {
    try {
      if (userType !== "admin" && username) {
        const response = await axios.get(
          `http://localhost:3000/notifications/${username}`
        );
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  function removeAllCookies() {
    const allCookies = Cookies.get();
    for (let cookie in allCookies) {
      Cookies.remove(cookie);
    }
  }

  // Fetch email for admin users
  const fetchEmail = async () => {
    try {
      if (userType === "admin" && username) {
        const response = await axios.get(
          `http://localhost:3000/email/${username}`
        );
        setUserEmail(response.data.email); // Set the email in the state
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  function handleLogout() {
    Object.keys(Cookies.get()).forEach((cookieName) =>
      Cookies.remove(cookieName)
    );
    fetchData();
  }

  const handleViewProfile = () => {
    const loggedInUser = Cookies.get("username");
    const userType = Cookies.get("userType");
    if (loggedInUser) {
      if (userType === "tourGuide") {
        navigate("/view-profile", { state: { username: loggedInUser } });
      } else if (userType === "advertiser") {
        navigate("/view-profileAdv", { state: { username: loggedInUser } });
      } else if (userType === "seller") {
        navigate("/view-profileSeller", { state: { username: loggedInUser } });
      } else {
        navigate("/TouristProfile", { state: { username: loggedInUser } });
      }
    }
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  return (
    <div className={fadeIn}>
            <GeneralNavbar />
            
      <h1 className="flex items-center justify-center space-between gap-36 mb-12 mt-10">
        Welcome {username}, you are a {userType}!!
      </h1>

    <div className="flex items-center justify-center space-between gap-36">
      {userType === "tourist" && (
        <div
          className="currency-selector"
          style={{
            position: "absolute",
            top: "70px", // Adjust as needed
            left: "20px", // Adjust as needed
            zIndex: 1000, // Ensure it stays on top of other elements
          }}
        >
          <h2>Select Currency:</h2>
          <select value={selectedCurrency} onChange={handleCurrencyChange}>
            {Object.keys(exchangeRates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      )}

      {userType === "admin" && userEmail && (
        <p>Your email: {userEmail}</p> // Display the email for admin users
      )}
      {/* <Button className={buttonStyle} onClick={handleLogout}>Logout</Button> */}
    

<HomeCard
            title="Change Password"
            description="Change your password showNotifications && notifications.length >and keep your account secure!"
            linkRoute="/changePassword"
          />

{userType !== "admin" && (
  <>
    {/* Notifications Button (Increased size) */}
    {!showNotifications && (
      <button
        className="absolute top-[1.7cm] right-4 z-10 p-4 text-3xl" // Increased padding and font size
        onClick={() => setShowNotifications(true)}
        aria-label="Open Notifications"
      >
        <NotificationsIcon style={{ fontSize: '2rem' }} /> {/* Adjust the icon size */}
      </button>
    )}

    {/* Notifications Popup (Centered) */}
    {showNotifications && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-lg font-semibold">Your Notifications</h2>
            <button
              className="text-gray-600"
              onClick={() => setShowNotifications(false)}
              aria-label="Close Notifications"
            >
              &times;
            </button>
          </div>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index} className="mb-2">
                  <p>{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      </div>
    )}
  </>
)}


     

      {userType !== "admin" && userType !== "tourismGoverner" && (
                <HomeCard
                title="View profile"
                description="View the latest updates of your profile"
                onClick={handleViewProfile}
              />
        // <Button className={buttonStyle} onClick={handleViewProfile}>View profile</Button>
      )}


      {userType === "tourismGoverner" && (
        <>

          <HomeCard
            title="Museums & Historical Places"
            description="View, Post & Manage Museums & Historical Places"
            linkRoute="/museums"
          />
</>

      )}

      {userType === "admin" && (
        <> 
          <Link to="/productList">
            <Button Name={buttonStyle}>All Gifts/Products</Button>
          </Link>
        <HomeCard
            title="Pending Requests"
            description="Manage pending requests from guides, advertisers, and sellers for approval"
            linkRoute="/pendingRequestsPage" 
          />
        <HomeCard
            title="Account Management"
            description="Oversee and manage user accounts, including creation, updates, and access control"
            linkRoute="/adminAccountManagement"
          />
        <HomeCard
            title="Manage Categories"
            description="Organize and maintain categories to ensure streamlined content classification"
            linkRoute="/Categorycontrol"
          />
        <HomeCard
            title="Manage Prefrence Tags"
            description="Customize and manage preference tags to enhance user personalization"
            linkRoute="/preferences"
          />
          <Link to="/revenue">
            <Button className={buttonStyle}>Financial Report</Button>
          </Link>
          <Link to="/itinerary">
            <Button className={buttonStyle}>View itineraries</Button>
          </Link>
          <Link to="/activities">
            <Button className={buttonStyle}>View Events</Button>
          </Link>
          <Link to="/complaint/view">
            <Button className={buttonStyle}>View Complaints</Button>
          </Link>
          <Link to="/all-gifts">
            <Button className={buttonStyle}>Gift Archival</Button>
          </Link>
        </>
      )}

{userType === "advertiser" && (
  <>
    <HomeCard
      title="All Gifts/Products"
      description="Browse all available gifts and products."
      linkRoute="/productList"
    />
    <HomeCard
      title="View Activities"
      description="Check out the activities you can participate in."
      linkRoute="/activities"
    />
    <HomeCard
      title="Financial Report"
      description="View your financial report and revenue insights."
      linkRoute="/revenue"
    />
    <HomeCard
      title="Tourist Report"
      description="View reports on tourist activities and trends."
      linkRoute="/totaltouristactivity"
    />
  </>
)}

      {userType === "seller" && (
        <>
          <HomeCard
            title="All Gifts/Products"
            description="Browse and manage your entire product catalog."
            linkRoute="/productList"
          />
          <HomeCard
            title="Financial Report"
            description="View detailed financial reports of your sales and revenue."
            linkRoute="/revenue"
          />
          <HomeCard
            title="Gift Archival"
            description="Access and manage archived gifts and products."
            linkRoute="/all-gifts"
          />
        </>
      )}


      {userType === "tourGuide" && (
        <>
        <HomeCard
            title="View Itineraries"
            description="Create and view your Itineraries"
            linkRoute="/itinerary"
          />
          <HomeCard
            title="Financial Report"
            description="Get a glimpse on your financial report"
            linkRoute="/revenue"
          />
          <HomeCard
            title="Tourist Report"
            description="View how your tourists are acting"
            linkRoute="/tourist-report"
          />
        </>
      )}
      {userType === "tourist" && (
          <>
            <Link to="/productList">
              <Button className={buttonStyle}>All Gifts/Products</Button>
            </Link>
            {/* <Link to="/ExplorePage">
              <Button className={buttonStyle}>Explore All Activities, Itineraries</Button>
            </Link> */}
            <Link to="/activities-featured">
              <Button className={buttonStyle}>Featured Activities</Button>
            </Link>
            <Link to="/featured-itineraries">
              <Button className={buttonStyle}>Featured Itineraries</Button>
            </Link>
            <Link to="/tourist/museums">
              <Button className={buttonStyle}>Museums & Historical Places</Button>
            </Link>
            {/* <Link to="/ViewAllItinerary">
              <Button className={buttonStyle}>View Itineraries</Button>
            </Link> */}
            {/* <Link to="/GiftList">
              <Button className={buttonStyle}>Gift Shop</Button>
            </Link> */}
            <Link to="/BookFLight">
              <Button className={buttonStyle}>Book Flight</Button>
            </Link>
            <Link to="/BookHotel">
              <Button className={buttonStyle}>Book Hotel</Button>
            </Link>
            <Link to="/bookTransport">
              <Button className={buttonStyle}>Book Transportation</Button>
            </Link>
            <div>
            <HomeCard
            title="View Wishlist"
            description="View your wishlist and manage it."
            linkRoute="/Wishlist"
          />
          </div>
          <div>
             <HomeCard
            title="Complaints"
            description="File or View your complaints and their status."
            linkRoute="/complaintManagement"
          />
          </div>

          <div>
          <HomeCard
            title="Shopping Cart"
            description="View your cart and proceed to checkout."
            linkRoute="/cart"
          />
          </div>

          <div>
          <HomeCard
            title="Help"
            description="Any Questions? We are here to help you!"
            linkRoute="/Help"
          />
          </div>

            <div>
            <HomeCard
            title="Manage Address Book"
            description="Manage your address book and add new addresses."
            linkRoute="/address"
          />
          </div>

          </>
        )}
    </div>
    </div>
  );
};

export default TempHomePage;
  