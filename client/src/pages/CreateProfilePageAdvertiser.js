import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import ProfileFormAdvertiser from '../components/ProfileFormAdvertiser'; // Update import to the correct form component

const CreateProfilePageAdvertiser = () => {
  const location = useLocation(); // Get the location state
  const navigate = useNavigate(); // Initialize navigate
  const { username, isEditingProfile } = location.state || {}; // Fallback to {} in case state is undefined

  const [formData, setFormData] = useState({
    companyName: '',
    mobileNumber: '',
    dateOfBirth: '',
    website: '',
    hotline: '',
    companyProfile: '',
    profilePicture: ''
  });

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the target
    setFormData({ ...formData, [name]: value }); // Update state with the new value
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

    // Prepare FormData for submission
    const formDataToSend = new FormData();
    formDataToSend.append('username', username);
    formDataToSend.append('mobileNumber', formData.mobileNumber);
    formDataToSend.append('companyName', formData.companyName);
    formDataToSend.append('website', formData.website);
    formDataToSend.append('hotline', formData.hotline);
    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
    formDataToSend.append('profilePicture', formData.profilePicture);
    formDataToSend.append('companyProfile', formData.companyProfile); // Append the link

    try {
      // Post the form data to the server
      await axios.post('http://localhost:3000/api/adv/profileAdv', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data' // Ensure the correct content type for file uploads
        }
      });
      alert('Profile updated successfully!');

      // Redirect to ViewProfilePage after successful update
      navigate('/view-profileAdv', { state: { username } }); // Pass username to the view profile page
    } catch (err) {
      console.error(err.response.data);
      alert('Error updating profile: ' + (err.response.data.error || 'An error occurred.'));
    }
  };

  return (
    <div>
      <h2>{isEditingProfile ? 'Edit Advertiser Profile' : 'Create Advertiser Profile'}</h2>
      <ProfileFormAdvertiser
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange} // Pass image handler
        buttonText={isEditingProfile ? 'Edit Profile' : 'Create Profile'}
      />
    </div>
  );
};

export default CreateProfilePageAdvertiser;
