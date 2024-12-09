import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

const ProfileFormSeller = ({ formData, handleChange, handleSubmit, handleImageChange, buttonText, isEditing }) => {
  const navigate = useNavigate(); // For navigation
  const handleMobileChange = (e) => {
    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 11) {
      handleChange(e);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100">
      {/* Conditional Back Button */}
      {isEditing && (
        <button
          className="absolute top-4 left-4 py-2 px-4 bg-black text-white rounded-lg shadow hover:bg-gray-600"
          onClick={() => navigate('/home')}
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
  
        {/* Name Input */}
        <div className="form-group mb-4">
          <label htmlFor="firstLastName" className="font-medium block mb-1">
            Name:
          </label>
          <input
            id="firstLastName"
            type="text"
            name="firstLastName"
            placeholder="Enter your name"
            value={formData.firstLastName}
            onChange={handleChange}
            required={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Description Input */}
        <div className="form-group mb-4">
          <label htmlFor="description" className="font-medium block mb-1">
            Description:
          </label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Enter a description"
            value={formData.description}
            onChange={handleChange}
            required={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
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
            required={!isEditing}
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

export default ProfileFormSeller;
