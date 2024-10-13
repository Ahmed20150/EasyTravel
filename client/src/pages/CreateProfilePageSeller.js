import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileFormSeller from '../components/ProfileFormSeller';

const CreateProfilePageSeller = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const { username, isEditingProfile } = location.state || {};

  const [formData, setFormData] = useState({
    mobileNumber: '',
    firstLastName: '',
    description: '',
    dateOfBirth: '',
    profilePicture: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle image change and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file size exceeds a certain limit (e.g., 5MB)
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > 5) {
        alert('File size exceeds the limit of 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result }); // Set base64 string
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      alert("Username is missing. Please log in again.");
      return;
    }
  
    try {
      await axios.post('http://localhost:3000/api/seller/profileSeller', {
        username,
        ...formData
      });
      alert('Profile updated successfully!');
      navigate('/view-profileSeller', { state: { username } });
    } catch (err) {
      // Check if err.response exists before accessing err.response.data
      if (err.response && err.response.data) {
        console.error(err.response.data);
        alert('Error updating profile: ' + err.response.data.error);
      } else {
        // Handle cases where no response or data is available (e.g., network error)
        console.error(err.message);
        alert('Error updating profile: ' + err.message);
      }
    }
  };
  
  

  return (
    <div>
      <h2>{isEditingProfile ? 'Edit Profile' : 'Create Profile'}</h2> 
      <ProfileFormSeller
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange} // Pass image handler
        buttonText={isEditingProfile ? 'Edit Profile' : 'Create Profile'}
      />
    </div>
  );
};

export default CreateProfilePageSeller;
