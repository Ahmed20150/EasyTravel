import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

//TODO figure out how to make fetchData accessible globally to all project files w/o having to implement it each time
const TempHomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // "fetchData()" is called when the component mounts (i.e when page is first opened)
        fetchData();
    }, []); // Add empty dependency array to run only once on mount

    async function fetchData() { // Function to check if user is logged in, by checking if cookie exists
        const accessToken = Cookies.get('token');
        const loggedInUser = Cookies.get('username');
        const userType = Cookies.get('userType');
        if (!accessToken) {
            console.log('No access token found');
            navigate("/");
            return;
        } else {
            console.log("COOKIES FOUND", accessToken);
            console.log("LOGGEDINUSER: ", loggedInUser);
            console.log("USERTYPE: ", userType);
        }
    }

    function removeAllCookies() {
        const allCookies = Cookies.get(); // Get all cookies
        for (let cookie in allCookies) {
          Cookies.remove(cookie); // Remove each cookie
        }
      }

    function handleLogout() { // Logout functionality that removes cookie and calls checker (leading to redirection to login)
        removeAllCookies();
        fetchData();
    }


    const [username, setUsername] = useState(Cookies.get('username'));
    const [userType, setUserType] = useState(Cookies.get('userType'));
    return (
        <div>
            <h1>Welcome {username}, you are an {userType}!!</h1>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/changePassword"><button>Change Password</button></Link>
        </div>
    );
}

export default TempHomePage;