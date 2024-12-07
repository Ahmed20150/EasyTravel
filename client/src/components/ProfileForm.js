import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import { Navbar, Button, Card, Footer } from "flowbite-react";
import {
  cardStyle,
  buttonStyle,
  fadeIn,
  centerVertically,
} from "../styles/AmrStyles"; // Import styles

const ProfileForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleImageChange,
  buttonText,
  isEditing,
}) => {
  const location = useLocation(); // Get the location state
  const { username} = location.state || {}; // Include existing data
  const navigate = useNavigate(); // For navigation
  const [uploadedFileName, setUploadedFileName] = useState(''); // State for file name

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > 5) {
        alert('File size exceeds the limit of 5MB.');
        e.target.value = null;
        return;
      }
      else{
        setUploadedFileName(file.name);
      }
    }
    handleImageChange(e); // Call the parent handler for file processing
  };

  const handleMobileChange = (e) => {
    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 11) {
      handleChange(e);
    }
  };

  return (
    <div
      className={`relative flex justify-center items-center h-screen bg-gray-100 ${fadeIn}`}
    >
      {/* Back to Home Page Button */}
      {isEditing ? <button
        className={`${buttonStyle} absolute top-4 left-4 py-2 px-4 rounded-lg`}
        onClick={() => navigate('/view-profile', { state: { username } })}
      >
        Back to Profile
      </button> : null}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {isEditing ? 'Edit Profile' : 'Create Profile'}
        </h2>

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

        <div className="form-group mb-4">
          <label htmlFor="yearsOfExperience" className="font-medium block mb-1">
            Years of Experience:
          </label>
          <input
            id="yearsOfExperience"
            type="number"
            name="yearsOfExperience"
            placeholder="Enter years of experience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            required={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="previousWork" className="font-medium block mb-1">
            Previous Work:
          </label>
          <input
            id="previousWork"
            type="text"
            name="previousWork"
            placeholder="Enter your previous work"
            value={formData.previousWork}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
              You do not need to change the date of birth as it is already
              saved.
            </p>
          )}
        </div>

        <div className="form-group mb-6">
          <label htmlFor="profilePicture" className="font-medium block mb-2">
            Profile Picture:
          </label>
          {isEditing && (
            <p className="text-gray-600 text-sm mb-2">
              Current picture uploaded. Upload a new one to change it:
            </p>
          )}
          <label
            htmlFor="profilePicture"
            className={`${buttonStyle} py-2 px-4 rounded-lg inline-block text-center cursor-pointer`}
          >
            Choose File
            <input
              id="profilePicture"
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange} // Custom file change handler
              className="hidden"
            />
          </label>
          {uploadedFileName && (
            <p className="mt-2 text-sm text-gray-700">
              <strong>Selected File:</strong> {uploadedFileName}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`${buttonStyle} w-full py-3 text-lg rounded-lg`}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;