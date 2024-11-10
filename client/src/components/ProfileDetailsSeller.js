import React from 'react';
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios'; // Import axios

const ProfileDetailsSeller = ({ profile, onEditClick }) => {
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
    <div>
      <h2>Profile Details</h2>
      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt="Profile"
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
      )}
      <p>Username: {profile.username}</p>
      <p>Name: {profile.firstLastName}</p>
      <p>Description: {profile.description}</p>
      <p>Mobile: {profile.mobileNumber ? `0${profile.mobileNumber}` : 'Not provided'}</p>
      <p>Date of Birth: {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
      <button onClick={onEditClick}>Edit Profile</button>
      <button
        className="delete-button"
        onClick={() => { handleRequest(profile.username, userType) }}  // Pass the correct user details
      >
        Request Delete
      </button>
      <Link to="/home"><button>Back</button></Link>

    </div>
  );
};

export default ProfileDetailsSeller;
