import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Input, Select, Card, Spinner, Toast, Modal } from 'flowbite-react'; // Import Modal from Flowbite
import { buttonStyle } from '../styles/GeneralStyles';

const PreferencePage = () => {
  const [preferenceName, setPreferenceName] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [updateOldName, setUpdateOldName] = useState('');
  const [updateNewName, setUpdateNewName] = useState('');
  const [deletePreferenceName, setDeletePreferenceName] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showToast, setShowToast] = useState(false); // State for toast visibility
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State for controlling modal visibility

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getAllPreferences'); // Update to your backend URL
      setPreferences(response.data);
    } catch (error) {
      console.error("Error fetching preferences", error);
    }
  };

  const showToastMessage = (message, color) => {
    setMessage(message);
    setMessageColor(color);
    setShowToast(true);

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const createPreference = async () => {
    setLoading(true);
    
    // Check if the preference already exists
    if (preferences.some(preference => preference.name === preferenceName)) {
      showToastMessage('This preference already exists!', 'failure');
      setLoading(false);
      return; // Stop further execution if preference exists
    }
    
    try {
      await axios.post('http://localhost:3000/api/preference', { name: preferenceName });
      showToastMessage('Preference created!', 'success');
      fetchPreferences();
    } catch (error) {
      showToastMessage('An unexpected error occurred while creating the preference.', 'failure');
    }
    setLoading(false);
  };
  

  const deletePreference = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/preference/${deletePreferenceName}`);
      showToastMessage('Preference deleted!', 'failure');
      fetchPreferences();
    } catch (error) {
      showToastMessage('An error occurred while deleting the preference.', 'failure');
    }
    setLoading(false);
  };

  const updatePreference = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/preference/${updateOldName}`, { name: updateNewName });
      showToastMessage('Preference updated!', 'info');
      fetchPreferences();
    } catch (error) {
      showToastMessage('An error occurred while updating the preference.', 'failure');
    }
    setLoading(false);
  };

  const preferenceOptions = [
    'Historic Areas',
    'Beaches',
    'Family-friendly',
    'Shopping',
    'Budget-friendly',
  ];

  return (
    <div className="preferences-container max-w-4xl mx-auto p-4">
<div className="absolute left-4 top-4">
    <Link to="/home">
      <Button className={buttonStyle}>Back</Button>
    </Link>
  </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4">
          <Toast>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-${messageColor}-500 text-white`}>
              {/* Dynamic Icon based on message color */}
              {messageColor === 'success' && <span>✔️</span>}
              {messageColor === 'failure' && <span>❌</span>}
              {messageColor === 'info' && <span>ℹ️</span>}
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
          </Toast>
        </div>
      )}

      {/* Create Preference Section */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold">Create Preference</h2>
        <Select
          id="preference"
          value={preferenceName}
          onChange={(e) => setPreferenceName(e.target.value)}
          className="w-full mb-4"
        >
          <option value="" disabled>-- Select Preference --</option>
          {preferenceOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </Select>
        <Button onClick={createPreference} disabled={loading} className={buttonStyle}>
          {loading ? <Spinner aria-label="Loading" /> : 'Create Preference'}
        </Button>
      </Card>

      {/* Read All Preferences Button */}
      <Card className="mb-8">
        <Button onClick={() => setModalOpen(true)} className={`${buttonStyle} mb-4`} gradientDuoTone="greenToBlue">
          Read All Preferences
        </Button>
      </Card>

      {/* Display Preferences Modal */}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>All Preferences</Modal.Header>
        <Modal.Body>
          {loading ? (
            <Spinner aria-label="Loading preferences" />
          ) : (
            <ul>
              {preferences.map((preference) => (
                <li key={preference._id}>{preference.name}</li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalOpen(false)} className={buttonStyle}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Preference Section */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold">Update Preference</h2>
        <Select
          id="old-preference"
          value={updateOldName}
          onChange={(e) => setUpdateOldName(e.target.value)}
          className="w-full mb-4"
        >
          <option value="" disabled>-- Select Old Preference --</option>
          {preferenceOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </Select>
        <Select
          id="new-preference"
          value={updateNewName}
          onChange={(e) => setUpdateNewName(e.target.value)}
          className="w-full mb-4"
        >
          <option value="" disabled>-- Select New Preference --</option>
          {preferenceOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </Select>
        <Button onClick={updatePreference} disabled={loading} className={buttonStyle}>
          {loading ? <Spinner aria-label="Loading" /> : 'Update Preference'}
        </Button>
      </Card>

      {/* Delete Preference Section */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold">Delete Preference</h2>
        <Select
          id="delete-preference"
          value={deletePreferenceName}
          onChange={(e) => setDeletePreferenceName(e.target.value)}
          className="w-full mb-4"
        >
          <option value="" disabled>-- Select Preference --</option>
          {preferenceOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </Select>
        <Button onClick={deletePreference} disabled={loading} className={buttonStyle}>
          {loading ? <Spinner aria-label="Loading" /> : 'Delete Preference'}
        </Button>
      </Card>
    </div>
  );
};

export default PreferencePage;
