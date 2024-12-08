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
  const [showNotifications, setShowNotifications] = useState(true);
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
    <div>
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
            description="Change your password and keep your account secure!"
            linkRoute="/changePassword"
          />

      {userType !== "admin" &&
        notifications.length > 0 &&
        showNotifications && (
          <div className="notifications">
            <div className="notifications-header">
              <h2>Your Notifications</h2>
              <Button className={buttonStyle}
                onClick={() => setShowNotifications(false)}
                aria-label="Close Notifications"
              >
                &times;
              </Button>
            </div>
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>
                  <p>{notification.message}</p>
                  <p>
                    <small>
                      {new Date(notification.timestamp).toLocaleString()}
                    </small>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

      {!showNotifications && notifications.length > 0 && (
        <Button className={buttonStyle}
          onClick={() => setShowNotifications(true)}
        >
          <NotificationsIcon />
        </Button>
      )}

      {userType !== "admin" && userType !== "tourismGoverner" && (
        <HomeCard
          title="View Profile"
          description="Access and update your personal information."
          linkRoute="#"
          onClick={handleViewProfile}
        />
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
          <Link to="/pendingRequestsPage">
            <Button className={buttonStyle}>Pending Requests</Button>
          </Link>
          <Link to="/adminAccountManagement">
            <Button className={buttonStyle}>Account Management</Button>
          </Link>
          <Link to="/Categorycontrol">
            <Button className={buttonStyle}>Manage Categories</Button>
          </Link>
          <Link to="/preferences">
            <Button className={buttonStyle}>Manage Prefrence Tags</Button>
          </Link>
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
          <Link to="/productList">
            <Button className={buttonStyle}>All Gifts/Products</Button>
          </Link>
          <Link to="/activities">
            <Button className={buttonStyle}>View Activities</Button>
          </Link>
          <Link to="/revenue">
            <Button className={buttonStyle}>Financial Report</Button>
          </Link>
          <Link to="/totaltouristactivity">
            <Button className={buttonStyle}>Tourist Report</Button>
          </Link>
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
          <Link to="/itinerary">
            <Button className={buttonStyle}>View Itineraries</Button>
          </Link>
          <Link to="/revenue">
            <Button className={buttonStyle}>Financial Report</Button>
          </Link>
          <Link to="/tourist-report">
            <Button className={buttonStyle}>Tourist Report</Button>
          </Link>
        </>
      )}
      {userType === "tourist" && (
        <>
          <Link to="/ViewAllItinerary">
            <Button className={buttonStyle}>Manage Events</Button>
          </Link>
          <Link to="/GiftList">
            <Button className={buttonStyle}>Gift Shop</Button>
          </Link>
          <Link to="/Help">
            <Button className={buttonStyle}>Help</Button>
          </Link>
        </>
      )}

      {userType === "tourist" && (
        <>
          <Link to="/productList">
            <Button className={buttonStyle}>All Gifts/Products</Button>
          </Link>
          <Link to="/ExplorePage">
            <Button className={buttonStyle}>Explore All Activities, Itineraries, Museums</Button>
          </Link>
          <Link to="/ViewAllItinerary">
            <Button className={buttonStyle}>View Itineraries</Button>
          </Link>
          <Link to="/GiftList">
            <Button className={buttonStyle}>Gift Shop</Button>
          </Link>
          <Link to="/BookFLight">
            <Button className={buttonStyle}>Book Flight</Button>
          </Link>
          <Link to="/BookHotel">
            <Button className={buttonStyle}>Book Hotel</Button>
          </Link>
          <Link to="/bookTransport">
            <Button className={buttonStyle}>Book Transportation</Button>
          </Link>
          <Link to="/Wishlist">
            <Button className={buttonStyle}>View Wishlist</Button>{" "}
          </Link>
          <Link to="/complaint/create">
            <Button className={buttonStyle}>File Complaint</Button>
          </Link>
          <Link to="/complaint/myList">
            <Button className={buttonStyle}>My Complaints</Button>
          </Link>
          <Link to="/cart">
          <Button className={buttonStyle} >Go to Cart</Button>
          </Link>
         
          <Link to="/address">
            <Button className={buttonStyle}>Manage Address Book</Button>
          </Link>
        </>
      )}
    </div>
    </div>
  );
};

export default TempHomePage;
