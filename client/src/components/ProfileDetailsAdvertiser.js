import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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


const ProfileDetailsAdvertiser = ({ profile, onEditClick }) => {
  const navigate = useNavigate(); // For navigation
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
  const userType = cookies.userType; // Access the userType
  // Create a URL for the base64 PDF
  const downloadPDF = () => {
    if (profile.companyProfile) {
      // Ensure that the profile.companyProfile is a valid base64 string without the data URL prefix
      const base64Data = profile.companyProfile;

      // Create a link source for the base64 data
      const linkSource = `data:application/pdf;base64,${base64Data}`;

      // Create a download link element
      const downloadLink = document.createElement('a');
      const fileName = 'company_profile.pdf';

      // Set the download link attributes
      downloadLink.href = linkSource;
      downloadLink.download = fileName;

      // Append the link to the body to ensure it works in all browsers
      document.body.appendChild(downloadLink);

      // Programmatically click the link to trigger the download
      downloadLink.click();

      // Remove the link from the DOM
      document.body.removeChild(downloadLink);
    } else {
      alert('No company profile available for download.');
    }
  };

  const handleRequest = async (username, role) => {
    //const input = { username, role };
    try {
      // Construct the URL with the username and role as query parameters
      const response = await axios.post(`http://localhost:3000/Request/requestDelete/${username}/${role}`);
      // Update state to remove the deleted user
      window.alert(`Request sent successfully: ${response.data.message}`);


      //delete all activities that were created by this user using username
      const deleteResponse = await axios.delete(`http://localhost:3000/activities/deleteAll/${username}`);
      window.alert(`Activities deleted successfully: ${deleteResponse.data.message}`);

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
        className="absolute top-4 left-4 py-2 px-4 bg-black text-white rounded-lg shadow hover:bg-gray-700"
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
            <strong>Company Name:</strong> {profile.companyName}
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
  
        {/* Company Information */}
        <h3 className="text-2xl font-semibold mt-6 mb-4">Company Information</h3>
        <div className="text-lg text-gray-700 w-full max-w-lg space-y-2">
          <p>
            <strong>Website:</strong>{' '}
            <a
              href={profile.website || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {profile.website || 'Not provided'}
            </a>
          </p>
          <p>
            <strong>Hotline:</strong> {profile.hotline || 'Not provided'}
          </p>
          <p>
            <strong>Company Profile:</strong>{' '}
            {profile.companyProfile ? (
              <button
                onClick={downloadPDF}
                className="bg-black text-white py-2 px-4 rounded-lg shadow hover:bg-gray-700"
              >
                Download PDF
              </button>
            ) : (
              'Not provided'
            )}
          </p>
        </div>
  
        <div className="flex flex-col items-center mt-6 space-y-4">
          <button
            className="w-40 py-3 bg-black text-white rounded-lg shadow text-lg hover:bg-gray-700"
            onClick={onEditClick}
          >
            Edit Profile
          </button>
          <button
            className="w-40 py-3 bg-red-500 text-white rounded-lg shadow text-lg hover:bg-red-600"
            onClick={() => handleRequest(profile.username, userType)}
          >
            Request Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDetailsAdvertiser;
