import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
import axios from 'axios';

//TODO figure out how to make fetchData accessible globally to all project files w/o having to implement it each time
const AdminAccountManagement = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // "fetchData()" is called when the component mounts (i.e when page is first opened)
        fetchData();
        // fetchBase64();

    }, []); // Add empty dependency array to run only once on mount

    async function fetchData() { // Function to check if user is logged in, by checking if cookie exists
        const accessToken = Cookies.get('token');
        const loggedInUser = Cookies.get('username');
        const userType = Cookies.get('userType');
        const acceptedTerms = Cookies.get('acceptedTerms');
        if (!accessToken || acceptedTerms==="false") {
            console.log('Should not have access to home!');
            navigate("/");
            return;
        } else {
            console.log("COOKIES FOUND", accessToken);
            console.log("LOGGEDINUSER: ", loggedInUser);
            console.log("USERTYPE: ", userType);
            console.log("ACCEPTEDTERMS:", acceptedTerms);
        }
    }

    return (
        <div className="container">
            <h1>Account Management</h1>
            <Link to="/home"><button>Back</button></Link>
            <Link to="/view-requests"> <button>Account Deletion Requests</button></Link>
            <Link to="/view-users"><button>All Users</button></Link>
            <Link to="/add-admin"><button>Create New Admin</button></Link>
            <Link to="/add-tourismGoverner"><button>Create New Toursim Governor</button></Link>
            
        </div>
    );
}

export default AdminAccountManagement;