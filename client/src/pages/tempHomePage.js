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

  useEffect(() => {
    // Check if coming from login page
    const fromLogin = sessionStorage.getItem('fromLogin');
    
    if (fromLogin === 'true') {
        // Clear the flag
        sessionStorage.removeItem('fromLogin');
        // Refresh the page
        window.location.reload();
    }
  }, []); // Empty dependency array means this runs once when component mounts

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

  // Update the button style definition
  const buttonStyle = "bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-center";

  return (
    <div className={fadeIn}>
        <GeneralNavbar />
        
        <h1 className="text-2xl font-bold text-center mb-8 mt-16">
            Welcome {username}, you are a {userType}!!
        </h1>

        <div className="flex flex-col space-y-4 max-w-md mx-auto mt-8">
            {/* Tourist Buttons */}
            {userType === "tourist" && (
                <>
                    <button onClick={handleViewProfile} className={buttonStyle}>
                        View Profile
                    </button>

                    <Link to="/viewUpcomingEvents" className="w-full">
                        <button className={buttonStyle}>Upcoming Events</button>
                    </Link>

                    <Link to="/viewPastEvents" className="w-full">
                        <button className={buttonStyle}>Past Events</button>
                    </Link>

                    <Link to="/tourist/museums" className="w-full">
                        <button className={buttonStyle}>Museums</button>
                    </Link>

                    <Link to="/ProductList" className="w-full">
                        <button className={buttonStyle}>Gift Shop</button>
                    </Link>

                    <Link to="/BookFLight" className="w-full">
                        <button className={buttonStyle}>Book Flight</button>
                    </Link>

                    <Link to="/BookHotel" className="w-full">
                        <button className={buttonStyle}>Book Hotel</button>
                    </Link>

                    <Link to="/bookTransport" className="w-full">
                        <button className={buttonStyle}>Book Transportation</button>
                    </Link>

                    <Link to="/cart" className="w-full">
                        <button className={buttonStyle}>Shopping Cart</button>
                    </Link>

                    <Link to="/address" className="w-full">
                        <button className={buttonStyle}>Address Book</button>
                    </Link>

                    <Link to="/Help" className="w-full">
                        <button className={buttonStyle}>Help</button>
                    </Link>
                </>
            )}

            {/* Admin Buttons */}
            {userType === "admin" && (
                <>
                    <Link to="/productList" className="w-full">
                        <button className={buttonStyle}>Products</button>
                    </Link>
                    <Link to="/pendingRequestsPage" className="w-full">
                        <button className={buttonStyle}>Pending Requests</button>
                    </Link>
                    <Link to="/adminAccountManagement" className="w-full">
                        <button className={buttonStyle}>Account Management</button>
                    </Link>
                </>
            )}

            {/* Tour Guide Buttons */}
            {userType === "tourGuide" && (
                <>
                    <button onClick={handleViewProfile} className={buttonStyle}>
                        View Profile
                    </button>
                    <Link to="/itinerary" className="w-full">
                        <button className={buttonStyle}>View Itineraries</button>
                    </Link>
                    <Link to="/revenue" className="w-full">
                        <button className={buttonStyle}>Financial Report</button>
                    </Link>
                    <Link to="/tourist-report" className="w-full">
                        <button className={buttonStyle}>Tourist Report</button>
                    </Link>
                </>
            )}

            {/* Tourism Governor Buttons */}
            {userType === "tourismGoverner" && (
                <>
                    <Link to="/tourismGoverner/museums" className="w-full">
                        <button className={buttonStyle}>Museums & Historical Places</button>
                    </Link>
                    <Link to="/add-museum" className="w-full">
                        <button className={buttonStyle}>Add Museum</button>
                    </Link>
                </>
            )}

            {/* Seller Buttons */}
            {userType === "seller" && (
                <>
                    <button onClick={handleViewProfile} className={buttonStyle}>
                        View Profile
                    </button>
                    <Link to="/productList" className="w-full">
                        <button className={buttonStyle}>All Gifts/Products</button>
                    </Link>
                    <Link to="/revenue" className="w-full">
                        <button className={buttonStyle}>Financial Report</button>
                    </Link>
                    <Link to="/all-gifts" className="w-full">
                        <button className={buttonStyle}>Gift Archival</button>
                    </Link>
                </>
            )}

            {/* Advertiser Buttons */}
            {userType === "advertiser" && (
                <>
                    <button onClick={handleViewProfile} className={buttonStyle}>
                        View Profile
                    </button>
                    <Link to="/productList" className="w-full">
                        <button className={buttonStyle}>All Gifts/Products</button>
                    </Link>
                    <Link to="/activities" className="w-full">
                        <button className={buttonStyle}>View Activities</button>
                    </Link>
                    <Link to="/revenue" className="w-full">
                        <button className={buttonStyle}>Financial Report</button>
                    </Link>
                    <Link to="/totaltouristactivity" className="w-full">
                        <button className={buttonStyle}>Tourist Report</button>
                    </Link>
                </>
            )}
        </div>
    </div>
  );
};

export default TempHomePage;
  