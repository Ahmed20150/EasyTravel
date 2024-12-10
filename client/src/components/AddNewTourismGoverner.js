import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Label, TextInput, Card, Toast } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';

// Apply the custom button style
export const buttonStyle = "bg-black text-white font-bold hover:bg-gray-700 transition-colors duration-300";

const AddTourismGoverner = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const governer = { username, password };

    try {
      const response = await axios.post('http://localhost:3000/admin/add-tourismGoverner', governer);
      setToastMessage(`Tourism Governer added successfully: ${response.data.message}`);
      setShowSuccessToast(true);
      setUsername('');
      setPassword('');
    } catch (error) {
      setToastMessage(
        error.response ? error.response.data.message : 'Error adding tourism governer. Please try again.'
      );
      setShowErrorToast(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Add New Tourism Governer</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Add Tourism Governer
          </Button>
        </form>
        <div className="mt-4">
          <Link to="/adminAccountManagement">
            <Button className={`${buttonStyle} w-full`}>
              Back
            </Button>
          </Link>
        </div>
      </Card>

      {/* Toast Messages */}
      {showSuccessToast && (
        <div className="absolute top-5 right-5">
          <Toast>
            <HiCheck className="h-5 w-5 text-green-500" />
            <div className="ml-3 text-sm font-normal">{toastMessage}</div>
            <Button
              className={`${buttonStyle} ml-auto`}
              size="xs"
              onClick={() => setShowSuccessToast(false)}
            >
              Close
            </Button>
          </Toast>
        </div>
      )}

      {showErrorToast && (
        <div className="absolute top-5 right-5">
          <Toast>
            <HiX className="h-5 w-5 text-red-500" />
            <div className="ml-3 text-sm font-normal">{toastMessage}</div>
            <Button
              className={`${buttonStyle} ml-auto`}
              size="xs"
              onClick={() => setShowErrorToast(false)}
            >
              Close
            </Button>
          </Toast>
        </div>
      )}
    </div>
  );
};

export default AddTourismGoverner;
