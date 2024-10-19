import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

  // Fetch existing user data if editing
  useEffect(() => {
    if (isEditingProfile && username) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/seller/profileSeller/${username}`);
          setFormData(response.data); // Set the existing data
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
      fetchData();
    }
  }, [isEditingProfile, username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > 5) {
        alert('File size exceeds the limit of 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
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
      if (err.response && err.response.data) {
        console.error(err.response.data);
        alert('Error updating profile: ' + err.response.data.error);
      } else {
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
        handleImageChange={handleImageChange}
        buttonText={isEditingProfile ? 'Edit Profile' : 'Create Profile'}
        isEditing={isEditingProfile}
      />
    </div>
  );
};

export default CreateProfilePageSeller;
