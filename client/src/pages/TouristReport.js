import React, { useState } from 'react';
import axios from 'axios';

const TouristReport = () => {
  const [month, setMonth] = useState(''); // Store the selected month
  const [totalTourists, setTotalTourists] = useState(null);
  const [allTourists, setAllTourists] = useState(null); // For storing total tourists across all months
  const [error, setError] = useState(null);

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
      const response = await axios.get(`http://localhost:3000/api/reports/tourist-report?month=${month}`);
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
      const response = await axios.get('http://localhost:3000/api/reports/tourist-report');
      setAllTourists(response.data.totalTourists); 
      setError(null);
    } catch (error) {
      console.error('Error fetching total tourists:', error);
      setError('Failed to fetch the total tourists. Please try again later.');
      setAllTourists(null);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '20px', color: '#333', textAlign: 'center', marginBottom: '20px' }}>Tourist Report</h1>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="month" style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block' }}>Select Month (1-12):</label>
        <input
          type="number"
          id="month"
          value={month}
          onChange={handleMonthChange}
          min="1"
          max="12"
          placeholder="Enter month"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button
        onClick={fetchTouristData}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '14px',
          color: '#fff',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Get Tourist Data for Selected Month
      </button>

      <button
        onClick={fetchAllTourists}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '14px',
          color: '#fff',
          backgroundColor: '#28a745',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        View All Tourists
      </button>

      {error && <div style={{ color: '#e74c3c', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

      {totalTourists !== null && (
        <div style={{
          padding: '15px',
          borderRadius: '6px',
          backgroundColor: '#f0f9ff',
          marginBottom: '10px',
          textAlign: 'center',
          color: '#007bff'
        }}>
          <h2 style={{ fontSize: '16px', marginBottom: '5px' }}>Total Tourists for Month {month}</h2>
          <p style={{ fontSize: '14px' }}>{totalTourists} tourists have used the itineraries in this month.</p>
        </div>
      )}

      {allTourists !== null && (
        <div style={{
          padding: '15px',
          borderRadius: '6px',
          backgroundColor: '#e8f5e9',
          textAlign: 'center',
          color: '#28a745'
        }}>
          <h2 style={{ fontSize: '16px', marginBottom: '5px' }}>Total Tourists Across All Months</h2>
          <p style={{ fontSize: '14px' }}>{allTourists} tourists have used the itineraries across all months.</p>
        </div>
      )}
    </div>
  );
};

export default TouristReport;
