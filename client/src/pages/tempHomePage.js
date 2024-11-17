import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext.js is in components folder

const TempHomePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [base64, setBase64] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const { selectedCurrency, setSelectedCurrency, exchangeRates } = useCurrency();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const accessToken = Cookies.get("token");
    const loggedInUser = Cookies.get("username");
    const userType = Cookies.get("userType");
    const acceptedTerms = Cookies.get("acceptedTerms");

    if (!accessToken || acceptedTerms === "false") {
      console.log("Should not have access to home!");
      navigate("/");
      return;
    } else {
      console.log("COOKIES FOUND", accessToken);
      console.log("LOGGEDINUSER: ", loggedInUser);
      console.log("USERTYPE: ", userType);
      console.log("ACCEPTEDTERMS:", acceptedTerms);
    }
  }

  function removeAllCookies() {
    const allCookies = Cookies.get();
    for (let cookie in allCookies) {
      Cookies.remove(cookie);
    }
  }

  function handleLogout() {
    removeAllCookies();
    fetchData();
  }

  const fetchBase64 = async () => {
    const loggedInUser = Cookies.get("username");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/files/getbasestring`,
        {
          params: { username: loggedInUser },
        }
      );
      setBase64(response.data.base64);
      setUploadedFile(response.data);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

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

  const [username] = useState(Cookies.get("username"));
  const [userType] = useState(Cookies.get("userType"));

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
        Welcome {username}, you are an {userType}!!
      </h1>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/changePassword">
        <button>Change Password</button>
      </Link>

      {userType !== "admin" && userType !== "tourismGoverner" && (
        <button onClick={handleViewProfile}>View profile</button>
      )}

      {userType === "tourismGoverner" && (
        <>
          <Link to="/museums">
            <button>Museums & Historical Places</button>
          </Link>
        </>
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
        </>
      )}
    </div>
  );
};

export default TempHomePage;
