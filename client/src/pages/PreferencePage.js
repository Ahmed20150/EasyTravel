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

  return (
    <div className="preferences-container">
      <div className="form-section">
        <h2>Create Preference</h2>
        <Link to="/home"><button>Back</button></Link>
        <input
          type="text"
          placeholder="Enter preference name"
          value={preferenceName}
          onChange={(e) => setPreferenceName(e.target.value)}
        />
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
        <input
          type="text"
          placeholder="Old preference name"
          value={updateOldName}
          onChange={(e) => setUpdateOldName(e.target.value)}
        />
        <input
          type="text"
          placeholder="New preference name"
          value={updateNewName}
          onChange={(e) => setUpdateNewName(e.target.value)}
        />
        <button onClick={updatePreference}>Update Preferences</button>
      </div>

      <div className="form-section">
        <h2>Delete Preference</h2>
        <input
          type="text"
          placeholder="Enter preference name to delete"
          value={deletePreferenceName}
          onChange={(e) => setDeletePreferenceName(e.target.value)}
        />
        <button onClick={deletePreference}>Delete Preferences</button>
      </div>

      {/* Display Error and Success Messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default PreferencePage;
