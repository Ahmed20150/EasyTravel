// LoginPage.js
import React from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import EasyTravelLogo from "../images/EasyTravel Transparent logo.png"; // Adjust the path as necessary
import { buttonStyle, linkStyle } from"../styles/gasserStyles";  // Adjust the path as necessary
import LoginForm from "../components/LoginForm";


const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - EasyTravel Logo */}
            <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
                <img src={EasyTravelLogo} alt="EasyTravel Logo" className="h-48 w-auto" />
            </div>

            {/* Right Side - Login Form */}
            <div className="md:w-1/2 flex items-center justify-center p-8">
              <LoginForm/>
            </div>
        </div>
    );
}

export default LoginPage;