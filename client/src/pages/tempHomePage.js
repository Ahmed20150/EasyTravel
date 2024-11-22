import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCurrency } from "../components/CurrencyContext";
import "./TempHomePage.css";
import NotificationsIcon from "@mui/icons-material/Notifications";

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
    <div className="container">
      {/* Currency Selector (Only for tourist user) */}
      {userType === "tourist" && (
        <div className="currency-selector">
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

      <h1>
        Welcome {username}, you are a {userType}!!
      </h1>
      {userType === "admin" && userEmail && (
        <p>Your email: {userEmail}</p> // Display the email for admin users
      )}
      <button onClick={handleLogout}>Logout</button>
      <Link to="/changePassword">
        <button>Change Password</button>
      </Link>

      {userType !== "admin" &&
        notifications.length > 0 &&
        showNotifications && (
          <div className="notifications">
            <div className="notifications-header">
              <h2>Your Notifications</h2>
              <button
                className="close-button"
                onClick={() => setShowNotifications(false)}
                aria-label="Close Notifications"
              >
                &times;
              </button>
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
        <button
          className="show-notifications-button"
          onClick={() => setShowNotifications(true)}
        >
          <NotificationsIcon />
        </button>
      )}

      {userType !== "admin" && userType !== "tourismGoverner" && (
        <button onClick={handleViewProfile}>View profile</button>
      )}

      {userType === "tourismGoverner" && (
        <Link to="/museums">
          <button>Museums & Historical Places</button>
        </Link>
      )}

      {userType === "admin" && (
        <>
          <Link to="/pendingRequestsPage">
            <button>Pending Requests</button>
          </Link>
          <Link to="/adminAccountManagement">
            <button>Account Management</button>
          </Link>
          <Link to="/Categorycontrol">
            <button>Manage Categories</button>
          </Link>
          <Link to="/preferences">
            <button>Manage Prefrence Tags</button>
          </Link>
          <Link to="/revenue">
            <button>Financial Report</button>
          </Link>
          <Link to="/itinerary">
            <button>View itineraries</button>
          </Link>
          <Link to="/activities">
            <button>View Events</button>
          </Link>
        </>
      )}

      {userType === "advertiser" && (
        <>
          <Link to="/activities">
            <button>View Activities</button>
          </Link>
          <Link to="/revenue">
            <button>Financial Report</button>
          </Link>
          <Link to="/totaltouristactivity">
            <button>Tourist Report</button>
          </Link>
        </>
      )}

      {userType === "seller" && (
        <>
          <Link to="/revenue">
            <button>Financial Report</button>
          </Link>
        </>
      )}

      {userType === "tourGuide" && (
        <>
          <Link to="/itinerary">
            <button>View Itineraries</button>
          </Link>
          <Link to="/revenue">
            <button>Financial Report</button>
          </Link>
          <Link to="/tourist-report">
            <button>Tourist Report</button>
          </Link>
        </>
      )}
      {userType === "tourist" && (
        <>
          <Link to="/ViewAllItinerary">
            <button>View Itineraries</button>
          </Link>
          <Link to="/GiftList">
            <button>Gift Shop</button>
          </Link>
          <Link to="/Help">
            <button>Help</button>
          </Link>
        </>
      )}

      {userType === "tourist" && (
        <>
          <Link to="/ExplorePage">
            <button>Explore All Activities, Itineraries, Museums</button>
          </Link>
          <Link to="/ViewAllItinerary">
            <button>View Itineraries</button>
          </Link>
          <Link to="/GiftList">
            <button>Gift Shop</button>
          </Link>
          <Link to="/BookFLight">
            <button>Book Flight</button>
          </Link>
          <Link to="/BookHotel">
            <button>Book Hotel</button>
          </Link>
          <Link to="/bookTransport">
            <button>Book Transportation</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default TempHomePage;
