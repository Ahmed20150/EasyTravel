import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//TODO make dynamic button placement with custom text for each user type more efficient
//TODO figure out how to make fetchData accessible globally to all project files w/o having to implement it each time
const TempHomePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [base64, setBase64] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    // "fetchData()" is called when the component mounts (i.e when page is first opened)
    fetchData();
    // fetchBase64();
  }, []); // Add empty dependency array to run only once on mount

  async function fetchData() {
    // Function to check if user is logged in, by checking if cookie exists
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
    const allCookies = Cookies.get(); // Get all cookies
    for (let cookie in allCookies) {
      Cookies.remove(cookie); // Remove each cookie
    }
  }

  function handleLogout() {
    // Logout functionality that removes cookie and calls checker (leading to redirection to login)
    removeAllCookies();
    fetchData();
  }

  const fetchBase64 = async (event) => {
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

    // console.log(fileName);
  };

      const handleViewProfile = () => {
        const loggedInUser = Cookies.get('username');
        const userType = Cookies.get('userType');
        if (loggedInUser) {
          if(userType === "tourGuide"){
            navigate('/view-profile', { state: { username: loggedInUser } });
          }
          else if(userType === "advertiser"){
            navigate('/view-profileAdv', { state: { username: loggedInUser } });
          }
          else if(userType === "seller"){
            navigate('/view-profileSeller', { state: { username: loggedInUser } });
          }
          else{
            navigate('/TouristProfile', { state: { username: loggedInUser } });
          }
      }
    }

    const [username, setUsername] = useState(Cookies.get('username'));
    const [userType, setUserType] = useState(Cookies.get('userType'));
    return (
        <div className="container">
            <h1>Welcome {username}, you are an {userType}!!</h1>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/changePassword"><button>Change Password</button></Link>
            
            
      {userType !== 'admin' && userType !== 'tourismGoverner' && (
        <button onClick={handleViewProfile}>View profile</button>
      )}

      {userType === "tourismGoverner" && (
        <>
          <Link to="/museums">
            <button>Museums & Historical Places</button>
          </Link>
        </>
      )}

        {userType === 'admin' && (
          <>
           <Link to="/pendingRequestsPage"><button>Pending Requests</button></Link>
           <Link to="/adminAccountManagement"><button>Account Management</button></Link>
           <Link to="/Categorycontrol"><button>Manage Categories</button></Link>
           <Link to="/preferences"><button>Manage Prefrence Tags</button></Link>
           <Link to="/revenue"><button>Financial Report</button></Link>
          </>
      )}
      {userType === 'advertiser' && (
        <>
            <Link to="/activities"><button>View Activities</button></Link>
            <Link to="/revenue"><button>Financial Report</button></Link>
        </>
      )}

      {userType === 'seller' && (
        <>
            <Link to="/revenue"><button>Financial Report</button></Link>
        </>
      )}

      {userType === "tourGuide" && (
        <>
        <Link to="/itinerary">
          <button>View Itineraries</button>
        </Link>
      <Link to="/revenue"><button>Financial Report</button></Link>
      </>
      )}
      {userType === "tourist" && (
        <>
        <Link to="/ViewAllItinerary"><button>View Itineraries</button></Link>
        <Link to="/GiftList"><button>Gift Shop</button></Link>
        </>
      )}


        </div>
    );
}

export default TempHomePage;
