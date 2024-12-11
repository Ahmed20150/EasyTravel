import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const TouristReport = () => {
  const [month, setMonth] = useState(''); // Store the selected month
  const [totalTourists, setTotalTourists] = useState(null);
  const [allTourists, setAllTourists] = useState(null); // For storing total tourists across all months
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation

  // Function to handle the month selection change
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  // Function to fetch the total number of tourists for the selected month
  const fetchTouristData = async () => {
    if (!month || month < 1 || month > 12) {
      setError('Please select a valid month (1-12).');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/allreports/tourist-report?month=${month}`);
      setTotalTourists(response.data.totalTourists); 
      setError(null);
    } catch (error) {
      console.error('Error fetching tourist report:', error);
      setError('Failed to fetch the tourist report. Please try again later.');
      setTotalTourists(null);
    }
  };


  // Function to fetch the total number of tourists for all itineraries
  const fetchAllTourists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/allreports/tourist-report');
      setAllTourists(response.data.totalTourists); 
      setError(null);
    } catch (error) {
      console.error('Error fetching total tourists:', error);
      setError('Failed to fetch the total tourists. Please try again later.');
      setAllTourists(null);
    }
  };

  return (
    <div
      className={`max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 ${fadeIn} `}
      style={{ fontFamily: "Arial, sans-serif" }}
    >
            <button
        className={`${buttonStyle} absolute top-4 left-4 py-2 px-4 rounded-lg`}
        onClick={() => navigate('/home')}
      >
        Back to Home Page
      </button> 
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Tourist Report
      </h1>

      {/* Month Input */}
      <div className="mb-5">
        <label
          htmlFor="month"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Month (1-12):
        </label>
        <input
          type="number"
          id="month"
          value={month}
          onChange={handleMonthChange}
          min="1"
          max="12"
          placeholder="Enter month"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <button
        onClick={fetchTouristData}
        className="w-full py-2 mb-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition duration-300"
      >
        Get Tourist Data for Selected Month
      </button>

      <button
        onClick={fetchAllTourists}
        className="w-full py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition duration-300"
      >
        View All Tourists
      </button>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 text-center text-sm my-4">{error}</div>
      )}

      {/* Total Tourists for Selected Month */}
      {totalTourists !== null && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-6 text-center">
          <h2 className="text-lg font-semibold text-blue-700">
            Total Tourists for Month {month}
          </h2>
          <p className="text-sm text-blue-600 mt-1">
            {totalTourists} tourists have used the itineraries this month.
          </p>
        </div>
      )}

      {/* Total Tourists Across All Months */}
      {allTourists !== null && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md mt-6 text-center">
          <h2 className="text-lg font-semibold text-green-700">
            Total Tourists Across All Months
          </h2>
          <p className="text-sm text-green-600 mt-1">
            {allTourists} tourists have used the itineraries across all months.
          </p>
        </div>
      )}
    </div>
  );
};

export default TouristReport;