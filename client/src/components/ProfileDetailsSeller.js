import React from 'react';
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios';
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle } from "../styles/gasserStyles"; 

const ProfileDetailsSeller = ({ profile, onEditClick }) => {
  const [cookies] = useCookies(["userType", "username"]);
  const userType = cookies.userType;

  const handleRequest = async (username, role) => {
    try {
      const response = await axios.post(`http://localhost:3000/Request/requestDelete/${username}/${role}`);
      window.alert(`Request sent successfully: ${response.data.message}`);
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
    <div className={`${cardStyle} ${fadeIn} p-6 mx-auto`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Profile Details</h2>
      
      {profile.profilePicture && (
        <div className="flex justify-center mb-4">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-36 h-36 object-cover rounded-full shadow-md"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Name:</strong> {profile.firstLastName}</p>
        <p><strong>Description:</strong> {profile.description}</p>
        <p><strong>Mobile:</strong> {profile.mobileNumber ? `0${profile.mobileNumber}` : 'Not provided'}</p>
        <p><strong>Date of Birth:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
      </div>
      
      <div className="flex justify-between mt-6 space-x-2">
        <button 
          onClick={onEditClick} 
          className={`${buttonStyle} flex-1 py-2 rounded`}
        >
          Edit Profile
        </button>
        
        <button
          className={`${buttonStyle} flex-1 py-2 rounded bg-red-600 hover:bg-red-700`}
          onClick={() => handleRequest(profile.username, userType)}
        >
          Request Delete
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/home" className={linkStyle}>
          <button className={`${buttonStyle} py-2 px-4 rounded`}>
            Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileDetailsSeller;