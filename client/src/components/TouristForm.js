// client/src/components/TouristForm.js

import React, { useState, useEffect } from 'react';
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

const TouristForm = ({ tourist, onUpdate, isEditing, setIsEditing }) => {
    const navigate = useNavigate(); // For navigation
    // Initialize formData with default values if tourist is undefined
    const [formData, setFormData] = useState({
        email: '',
        mobileNumber: '',
        nationality: '',
        dateOfBirth: '',
        occupation: '',
    });

    useEffect(() => {
        if (tourist) {
            setFormData({
                email: tourist.email || '',
                mobileNumber: tourist.mobileNumber || '',
                nationality: tourist.nationality || '',
                dateOfBirth: tourist.dateOfBirth ? new Date(tourist.dateOfBirth).toISOString().split('T')[0] : '',
                occupation: tourist.occupation || '',
            });
        }
    }, [tourist]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onUpdate(formData);
    };

    return (
        <div className="relative flex justify-center items-center h-screen bg-gray-100">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>
      
            {/* Email Input */}
            <div className="form-group mb-4">
              <label htmlFor="email" className="font-medium block mb-1">
                Email:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
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
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
      
            {/* Nationality Input */}
            <div className="form-group mb-4">
              <label htmlFor="nationality" className="font-medium block mb-1">
                Nationality:
              </label>
              <input
                id="nationality"
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="Enter your nationality"
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
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
      
            {/* Occupation Input */}
            <div className="form-group mb-4">
              <label htmlFor="occupation" className="font-medium block mb-1">
                Occupation:
              </label>
              <input
                id="occupation"
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Enter your occupation"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
      
            {/* Action Buttons */}
            <div className="flex justify-between space-x-4 mt-6">
              <button
                type="submit"
                className="w-1/2 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-1/2 py-3 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
};

export default TouristForm;
