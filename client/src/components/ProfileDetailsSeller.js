import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios'; // Import axios
import { Navbar, Button, Card, Footer } from "flowbite-react";
import {
  cardStyle,
  buttonStyle,
  walletSectionStyle,
  itineraryListStyle,
  promoCodeListStyle,
  userLevelBadge,
  fadeIn
} from "../styles/AmrStyles"; // Import styles

const ProfileDetailsSeller = ({ profile, onEditClick }) => {
  const navigate = useNavigate(); // For navigation
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
  const userType = cookies.userType; // Access the userType
  const handleRequest = async (username, role) => {
    //const input = { username, role };
    try {
      // Construct the URL with the username and role as query parameters
      const response = await axios.post(`http://localhost:3000/Request/requestDelete/${username}/${role}`);
      // Update state to remove the deleted user
      window.alert(`Request sent successfully: ${response.data.message}`);
      // Filter out the deleted user from the UI
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred: " + error.message);
      }
    }
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center h-screen bg-gray-100 p-6"
    >
      <button
        className={`${buttonStyle} absolute top-4 left-4 py-2 px-4 rounded-lg`}
        onClick={() => navigate('/home')}
      >
        Back to Home Page
      </button>
      <form
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Profile Details</h2>
  
        <div className="mb-6 flex justify-center items-center">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-300 flex justify-center items-center text-white font-semibold text-2xl">
              No Image
            </div>
          )}
        </div>
  
        <div className="text-lg text-gray-700 w-full max-w-lg text-center space-y-2">
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Name:</strong> {profile.firstLastName}
          </p>
          <p>
            <strong>Description:</strong> {profile.description}
          </p>
          <p>
            <strong>Mobile:</strong>{' '}
            {profile.mobileNumber ? `0${profile.mobileNumber}` : 'Not provided'}
          </p>
          <p>
            <strong>Date of Birth:</strong>{' '}
            {new Date(profile.dateOfBirth).toLocaleDateString()}
          </p>
        </div>
  
        <div className="flex flex-col items-center mt-6 space-y-4">
          <Button
            className={`${buttonStyle} w-40 py-3 text-lg rounded-lg`}
            onClick={onEditClick}
          >
            Edit Profile
          </Button>
          <Button
            className={`${buttonStyle} w-40 py-3 text-lg rounded-lg bg-red-500`}
            onClick={() => handleRequest(profile.username, userType)}
          >
            Request Delete
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDetailsSeller;
