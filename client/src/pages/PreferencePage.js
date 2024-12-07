// src/PreferencePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
// import './PreferencePage.css'; // Import the CSS file for styling


//TODO fix create prefrence, accepts only Shopping??
const PreferencePage = () => {
  const [preferenceName, setPreferenceName] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [updateOldName, setUpdateOldName] = useState('');
  const [updateNewName, setUpdateNewName] = useState('');
  const [deletePreferenceName, setDeletePreferenceName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/preference'); // Update to your backend URL
      setPreferences(response.data);
    } catch (error) {
      console.error("Error fetching preferences", error);
    }
  };

  const createPreference = async () => {
    try {
      await axios.post('http://localhost:3000/api/preference', { name: preferenceName });
      setSuccessMessage('Preference created!');
      setErrorMessage('');
      fetchPreferences();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred while creating the preference.');
      }
      setSuccessMessage('');
    }
  };

  const deletePreference = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/preference/${deletePreferenceName}`);
      setSuccessMessage('Preference deleted!');
      setErrorMessage('');
      fetchPreferences();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred while deleting the preference.');
      }
      setSuccessMessage('');
    }
  };

  const updatePreference = async () => {
    try {
      await axios.put(`http://localhost:3000/api/preference/${updateOldName}`, { name: updateNewName });
      setSuccessMessage('Preference updated!');
      setErrorMessage('');
      fetchPreferences();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred while updating the preference.');
      }
      setSuccessMessage('');
    }
  };

  
  const preferenceOptions = [
    'Historic Areas',
    'Beaches',
    'Family-friendly',
    'Shopping',
    'Budget-friendly',
  ];

  return (
    <div className="preferences-container">
      <div className="form-section">
        <h2>Create Preference</h2>
        <Link to="/home"><button>Back</button></Link>
        {/* <input
          type="text"
          placeholder="Enter preference name"
          value={preferenceName}
          onChange={(e) => setPreferenceName(e.target.value)}
        /> */}
          <select
        id="preference"
        value={preferenceName}
        onChange={(e) => setPreferenceName(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '0.375rem',
          outline: 'none',
          fontSize: '1rem',
          marginBottom: '1rem',
          appearance: 'none', // Removes default arrow, optional
          backgroundColor: '#FFFFFF',
          backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%23999\' viewBox=\'0 0 16 16\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M1.646 4.646a.5.5 0 011 0L8 10.293l5.354-5.647a.5.5 0 11.708.708l-6 6.3a.5.5 0 01-.708 0l-6-6.3a.5.5 0 010-.708z\'/%3E%3C/svg%3E%0A")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
        }}
      >
        <option value="" disabled>
          -- Select Preference --
        </option>
        {preferenceOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
        <button onClick={createPreference}>Create Preferences</button>
      </div>

      <div className="form-section">
        <h2>All Preferences</h2>
        <button onClick={fetchPreferences}>Read Preferences</button>
        <ul>
          {preferences.map((preference) => (
            <li key={preference._id}>{preference.name}</li>
          ))}
        </ul>
      </div>

      <div className="form-section">
        <h2>Update Preference</h2>
        {/* <input
          type="text"
          placeholder="Old preference name"
          value={updateOldName}
          onChange={(e) => setUpdateOldName(e.target.value)}
        /> */}
           <select
        id="preference"
        value={updateOldName}
        onChange={(e) => setUpdateOldName(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '0.375rem',
          outline: 'none',
          fontSize: '1rem',
          marginBottom: '1rem',
          appearance: 'none', // Removes default arrow, optional
          backgroundColor: '#FFFFFF',
          backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%23999\' viewBox=\'0 0 16 16\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M1.646 4.646a.5.5 0 011 0L8 10.293l5.354-5.647a.5.5 0 11.708.708l-6 6.3a.5.5 0 01-.708 0l-6-6.3a.5.5 0 010-.708z\'/%3E%3C/svg%3E%0A")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
        }}
      >
        <option value="" disabled>
          -- Select Old Preference --
        </option>
        {preferenceOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
        {/* <input
          type="text"
          placeholder="New preference name"
          value={updateNewName}
          onChange={(e) => setUpdateNewName(e.target.value)}
        /> */}
              <select
        id="preference"
        value={updateNewName}
        onChange={(e) => setUpdateNewName(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '0.375rem',
          outline: 'none',
          fontSize: '1rem',
          marginBottom: '1rem',
          appearance: 'none', // Removes default arrow, optional
          backgroundColor: '#FFFFFF',
          backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%23999\' viewBox=\'0 0 16 16\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M1.646 4.646a.5.5 0 011 0L8 10.293l5.354-5.647a.5.5 0 11.708.708l-6 6.3a.5.5 0 01-.708 0l-6-6.3a.5.5 0 010-.708z\'/%3E%3C/svg%3E%0A")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
        }}
      >
        <option value="" disabled>
          -- Select New Preference --
        </option>
        {preferenceOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
        <button onClick={updatePreference}>Update Preferences</button>
      </div>

      <div className="form-section">
        <h2>Delete Preference</h2>
        {/* <input
          type="text"
          placeholder="Enter preference name to delete"
          value={deletePreferenceName}
          onChange={(e) => setDeletePreferenceName(e.target.value)}
        /> */}
           <select
        id="preference"
        value={deletePreferenceName}
        onChange={(e) => setDeletePreferenceName(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '0.375rem',
          outline: 'none',
          fontSize: '1rem',
          marginBottom: '1rem',
          appearance: 'none', // Removes default arrow, optional
          backgroundColor: '#FFFFFF',
          backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%23999\' viewBox=\'0 0 16 16\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M1.646 4.646a.5.5 0 011 0L8 10.293l5.354-5.647a.5.5 0 11.708.708l-6 6.3a.5.5 0 01-.708 0l-6-6.3a.5.5 0 010-.708z\'/%3E%3C/svg%3E%0A")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
        }}
      >
        <option value="" disabled>
          -- Select Preference --
        </option>
        {preferenceOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
        <button onClick={deletePreference}>Delete Preferences</button>
      </div>

      {/* Display Error and Success Messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default PreferencePage;
