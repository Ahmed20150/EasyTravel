import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import { Navbar, Button, Card, Footer } from "flowbite-react";
import {
  cardStyle,
  buttonStyle,
  fadeIn,
  centerVertically,
} from "../styles/AmrStyles"; // Import styles

const ProfileFormAdvertiser = ({ formData, handleChange, handleSubmit, handleImageChange, handleFileChange, buttonText, isEditing }) => {
  const location = useLocation(); // Get the location state
  const navigate = useNavigate(); // For navigation
  // Custom handleChange to monitor the mobile number length
  const handleMobileChange = (e) => {
    // Ensure the input is numeric and within the length limit
    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 11) {
      handleChange(e); // Only update state if the value is a number and <= 11 digits
    }
  };

  // Custom handleChange for hotline
  const handleHotlineChange = (e) => {
    // Ensure the input is numeric
    if (/^\d*$/.test(e.target.value)) {
      handleChange(e); // Only update state if the value is a number
    }
  };

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-gray-100"
    >
      {/* Conditional Back Button */}
      {isEditing && (
        <button
          className="absolute top-4 left-4 py-2 px-4 bg-black text-white rounded-lg shadow hover:bg-gray-600"
          onClick={() => navigate('/home',)}
        >
          Back to Home Page
        </button>
      )}
  
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {isEditing ? 'Edit Profile' : 'Create Profile'}
        </h2>
  
        {/* Mobile Number Input */}
        <div className="form-group mb-4">
          <label htmlFor="mobileNumber" className="font-medium block mb-1">
            Mobile Number:
          </label>
          <input
            id="mobileNumber"
            type="tel"
            name="mobileNumber"
            placeholder="Enter your mobile number"
            value={formData.mobileNumber}
            onChange={handleMobileChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Date of Birth Input */}
        <div className="form-group mb-4">
          <label htmlFor="dateOfBirth" className="font-medium block mb-1">
            Date of Birth:
          </label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isEditing && (
            <p className="text-gray-600 text-sm mt-1">
              You do not need to change the date of birth as it is already saved.
            </p>
          )}
        </div>
  
        {/* Company Name Input */}
        <div className="form-group mb-4">
          <label htmlFor="companyName" className="font-medium block mb-1">
            Company Name:
          </label>
          <input
            id="companyName"
            type="text"
            name="companyName"
            placeholder="Enter your company name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Website Input */}
        <div className="form-group mb-4">
          <label htmlFor="website" className="font-medium block mb-1">
            Website:
          </label>
          <input
            id="website"
            type="text"
            name="website"
            placeholder="Enter your website"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Hotline Input */}
        <div className="form-group mb-4">
          <label htmlFor="hotline" className="font-medium block mb-1">
            Hotline:
          </label>
          <input
            id="hotline"
            type="text"
            name="hotline"
            placeholder="Enter your hotline"
            value={formData.hotline}
            onChange={handleHotlineChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* PDF Company Profile Input */}
        <div className="form-group mb-4">
          <label htmlFor="companyProfile" className="font-medium block mb-1">
            Company Profile (PDF):
          </label>
          {isEditing && (
            <p className="text-gray-600 text-sm mb-2">
              Current PDF uploaded. To change, upload a new one:
            </p>
          )}
          <input
            id="companyProfile"
            type="file"
            name="companyProfile"
            accept="application/pdf"
            onChange={handleFileChange}
            required={!isEditing}
            className="block w-full text-gray-500"
          />
        </div>
  
        {/* Profile Picture Input */}
        <div className="form-group mb-6">
          <label htmlFor="profilePicture" className="font-medium block mb-1">
            Profile Picture:
          </label>
          {isEditing && (
            <p className="text-gray-600 text-sm mb-2">
              Current picture uploaded. Upload a new one to change it:
            </p>
          )}
          <input
            id="profilePicture"
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleImageChange}
            required={!isEditing}
            className="block w-full text-gray-500"
          />
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-lg shadow text-lg hover:bg-gray-600"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default ProfileFormAdvertiser;
