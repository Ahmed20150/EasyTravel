import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Button, Label, TextInput, Modal, Toast } from 'flowbite-react';
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

// Apply the custom button style
export const buttonStyle = "bg-black text-white font-bold hover:bg-gray-700 transition-colors duration-300";

const AddNewAdmins = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const admin = { username, password };

    try {
      const response = await axios.post('http://localhost:3000/admin/add-admin', admin);
      console.log('Admin Added:', response.data);
      setShowSuccess(true);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setErrorMessage(error.response ? error.response.data.message : error.message);
      setShowError(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="username" value="Username" />
            <TextInput
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className={`${buttonStyle} w-full`}>
            Add Admin
          </Button>
        </form>

        <div className="mt-4">
          <Link to="/adminAccountManagement">
            <Button className={`${buttonStyle} w-full`}>
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <Toast className="fixed bottom-4 right-4">
          <HiOutlineCheck className="h-5 w-5 text-green-500" />
          <div className="ml-3 text-sm font-normal">
            Admin added successfully.
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 rounded-lg p-1.5 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </Toast>
      )}

      {/* Error Modal */}
      <Modal show={showError} onClose={() => setShowError(false)}>
        <Modal.Header>Error</Modal.Header>
        <Modal.Body>
          <p className="text-sm text-gray-600">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowError(false)} className={`${buttonStyle} w-full`}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddNewAdmins;
