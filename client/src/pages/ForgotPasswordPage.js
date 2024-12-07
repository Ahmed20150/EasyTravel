// ForgotPasswordPage.js
import React from "react";
import { Link } from "react-router-dom";
import EasyTravelLogo from "../images/EasyTravel Transparent logo.png"; // Adjust the path as necessary
import { buttonStyle, linkStyle } from "../styles/gasserStyles"; // Adjust the path as necessary
import ForgotPasswordForm from "../components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 p-4">
            {/* EasyTravel Logo */}
            <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0 md:pr-8">
                <img
                    src={EasyTravelLogo}
                    alt="EasyTravel Logo"
                    className="h-72 w-auto"
                />
            </div>

            {/* Forgot Password Form Container */}
            <div className="w-full md:w-1/2 max-w-lg bg-white p-8 border rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-6">Forgot Your Password?</h2>
                <ForgotPasswordForm />

      
            </div>
        </div>
    );
}

export default ForgotPasswordPage;