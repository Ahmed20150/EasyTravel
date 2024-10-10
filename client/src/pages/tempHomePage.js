import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const TempHomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // "fetchData()" is called when the component mounts (i.e when page is first opened)
        fetchData();
    }, []); // Add empty dependency array to run only once on mount

    async function fetchData() { // Function to check if user is logged in, by checking if cookie exists
        const accessToken = Cookies.get('token');
        const loggedInUser = Cookies.get('username');
        if (!accessToken) {
            console.log('No access token found');
            navigate("/");
            return;
        } else {
            console.log("COOKIES FOUND", accessToken);
            console.log("LOGGEDINUSER: ", loggedInUser);
        }
    }

    function handleLogout() { // Logout functionality that removes cookie and calls checker (leading to redirection to login)
        Cookies.remove('token');
        fetchData();
    }

    return (
        <div>
            <h1>Welcome to the Home Page!!</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default TempHomePage;