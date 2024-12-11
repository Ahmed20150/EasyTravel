import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import AddMuseumForm from "../components/AddMuseumForm";

const AddMuseumPage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['username']);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Ensure username is available from cookies
    if (!cookies.username) {
      navigate('/login'); // Redirect to login if no username
      return;
    }
    setUsername(cookies.username);
  }, [cookies.username, navigate]);

  const handleFormSubmit = () => {
    // Refresh museums after adding a new one
    navigate('/tourismGoverner/museums'); // Redirect back to the museums list page
  };

  if (!username) {
    return null; // Prevent rendering until username is confirmed
  }

  return (
    <div className="add-museum-page">
      <h1 className="title">Add New Museum</h1>
      <AddMuseumForm 
        username={username} 
        refreshMuseums={handleFormSubmit} 
      />
    </div>
  );
};

export default AddMuseumPage;