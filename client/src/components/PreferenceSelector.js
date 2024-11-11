// client/src/components/PreferenceSelector.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PreferenceSelector = ({ username, currentPreferences, onPreferencesUpdate }) => {
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState(currentPreferences || []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/preference');
        setPreferences(response.data);
      } catch (err) {
        console.error("Error fetching preferences:", err);
      }
    };
    fetchPreferences();
  }, []);

  const handleCheckboxChange = (preference) => {
    setSelectedPreferences(prevState => {
      if (prevState.includes(preference)) {
        return prevState.filter(item => item !== preference);
      } else {
        return [...prevState, preference];
      }
    });
  };

  const handleSavePreferences = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/tourist/${username}/preferences`, {
        preferences: selectedPreferences,
      });
      onPreferencesUpdate(selectedPreferences); // Update parent component with new preferences
    } catch (err) {
      console.error("Error updating preferences:", err);
    }
  };

  return (
    <div>
      <h3>Select Your Preferences</h3>
      {preferences.map((preference) => (
        <div key={preference.name}>
          <label>
            <input
              type="checkbox"
              checked={selectedPreferences.includes(preference.name)}
              onChange={() => handleCheckboxChange(preference.name)}
            />
            {preference.name}
          </label>
        </div>
      ))}
      <button onClick={handleSavePreferences}>Save Preferences</button>
    </div>
  );
};

export default PreferenceSelector;
