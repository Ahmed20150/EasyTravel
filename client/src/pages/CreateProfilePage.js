import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import ProfileForm from '../components/ProfileForm';

const CreateProfilePage = () => {
  const location = useLocation(); // Get the location state
  const navigate = useNavigate(); // Initialize navigate
  const { username, isEditingProfile } = location.state || {}; // Fallback to {} in case state is undefined

  const [formData, setFormData] = useState({
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    dateOfBirth: '',
    profilePicture: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
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
      await axios.post('http://localhost:3000/api/profile', {
        username, // Send the username from state
        ...formData // Spread the form data
      });
      alert('Profile updated successfully!');

      // Redirect to ViewProfilePage after successful update
      navigate('/view-profile', { state: { username } }); // Pass username to the view profile page
    } catch (err) {
      console.error(err.response.data);
      alert('Error updating profile: ' + err.response.data.error);
    }
  };

  return (
    <div>
      <h2>{isEditingProfile ? 'Edit Profile' : 'Create Profile'}</h2> 
      <ProfileForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        buttonText={isEditingProfile ? 'Edit Profile' : 'Create Profile'}
      />
    </div>
  );
};

export default CreateProfilePage;
